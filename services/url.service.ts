import { StatusCodes } from "http-status-codes";
import { URL, URLClick } from "../prisma/db";
import ErrorParent, {
	BadrequestError,
	NotFoundError,
} from "../middlewears/error";
import argon from "argon2";
import axios from "axios";

class UrlService {
	/**
	 * Creates a new URL entry in the database.
	 * @param data - The data for creating the URL.
	 * @returns The created URL entry.
	 * @throws BadrequestError if the URL is invalid, the short URL is already taken, or the expiration date is not within 6 months.
	 */
	public create = async (data: UrlServiceCreate) => {
		let hashed_password: string | undefined;

		if (!this.isValidURL(data.long_url))
			throw new BadrequestError("Invalid URL provided.");

		let valid_short_url = false;

		do {
			if (!data.short_url) {
				// Generates a random string with the length between 5-8 inclusively.
				data.short_url = this.generateRandomString(
					Math.floor(Math.random() * (8 - 5 + 1)) + 5
				);
			} else {
				if (
					!(
						data.short_url.length >= 5 &&
						(data.short_url as string).length <= 8
					)
				) {
					throw new BadrequestError(
						"Short URL must be between 5-8 characters."
					);
				}
			}

			// Check if the URL is already taken.
			const existing_url = await URL.findFirst({
				where: { short_url: data.short_url },
			});

			if (existing_url && data.short_url)
				throw new BadrequestError("Short URL is already taken.");

			if (!existing_url) {
				valid_short_url = true;
				break;
			}
		} while (valid_short_url === false);

		if (!this.isWithinSixMonths(new Date(data.expiration_date)))
			throw new BadrequestError(
				"Expiration date must be within 6 months."
			);

		if (data.password) {
			hashed_password = await this.hashPassword(data.password);
		}

		// TODO: Figure if the long_url is safe
		// TODO: Generate QR Code
		const url = await URL.create({
			data: {
				short_url: data.short_url,
				long_url: data.long_url,
				expiration_date: new Date(data.expiration_date),
				password: hashed_password,
				owner_id: data.user_id && data.user_id,
			},
		});

		return url;
	};

	public getMany = async () => {
		return 0;
	};

	public visit = async (id: string, user_info: any) => {
		const { _ip, browser, os } = user_info;
		const ip = "197.210.29.208";
		// TODO:
		// -	is_safe
		// -   password
		// -   qr code

		try {
			const url = await URL.update({
				where: {
					short_url: id,
				},
				data: {
					last_visited: new Date(),
				},
			});

			const url_click = await URLClick.create({
				data: {
					url_id: url.id,
					ip,
					is_unique: await this.isUnique(ip, url.id),
					browser:
						browser && browser.name !== undefined
							? browser.name + " | " + browser.version
							: undefined,
					OS:
						os && os.name !== undefined
							? +" | " + os.version
							: undefined,
				},
			});

			// Update user IP info in background worker
			// TODO: Let workers handle this
			await this.updateUserIpInfo(ip, url_click.id);

			return url.long_url;
		} catch (error: any) {
			console.log(error);
			if (error.code === "P2025") {
				throw new NotFoundError("URL does not exists");
			}
			throw new ErrorParent(
				error.message,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	};

	public update = async () => {
		return 0;
	};

	public delete = async () => {
		return 0;
	};

	private isValidURL(str: string) {
		var pattern = new RegExp(
			"^(https?:\\/\\/)?" + // protocol
				"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
				"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
				"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
				"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
				"(\\#[-a-z\\d_]*)?$",
			"i"
		); // fragment locator
		return pattern.test(str);
	}

	private isWithinSixMonths(date: Date) {
		const currentDate = new Date();
		const sixMonthsFromNow = new Date();
		sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

		return date <= sixMonthsFromNow && date >= currentDate;
	}

	private generateRandomString = (length: number): string => {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	};

	private hashPassword = async (password: string) => {
		return await argon.hash(password);
	};

	/**
	 * Checks if a given IP and URL combination is unique within the last 7 days.
	 * @param ip - The IP address to check.
	 * @param url_id - The URL ID to check.
	 * @returns A boolean indicating whether the IP and URL combination is unique.
	 */
	private isUnique = async (ip: string, url_id: string) => {
		const url_click = await URLClick.findFirst({
			where: {
				ip,
				url_id,
				created_at: {
					gte: new Date(
						new Date().getTime() - 1000 * 60 * 60 * 24 * 7
					),
				}, // 7 days
			},
		});
		console.log(url_click);
		return url_click ? false : true;
	};

	private updateUserIpInfo = async (ip: string, url_click_id: string) => {
		try {
			const request = await axios.get(
				`http://api.weatherapi.com/v1/ip.json?key=${"cb275d17ab454d83943200744243006"}&q=${ip}`
			);

			const {
				city,
				country_name: country,
				lat,
				lon,
				region,
				tz_id: timezone,
				type: ip_type,
			} = request.data;

			await URLClick.update({
				where: {
					id: url_click_id,
				},
				data: {
					ip_type,
					city,
					country,
					region,
					timezone,
					lat,
					lon,
				},
			});
			console.log("Successfully updated user's location!");
		} catch (error: any) {
			if (error.code == 400) {
				console.log("Invalid IP provided.");
			} else if (error.code == "P2025") {
				console.log("Record not found.");
			} else {
				console.log("Fetch Error", error.message);
			}
		}
	};
}

export default new UrlService();

type UrlServiceCreate = {
	short_url: string | undefined;
	long_url: string;
	expiration_date: Date;
	password: string | undefined;
	user_id: string | undefined;
};
