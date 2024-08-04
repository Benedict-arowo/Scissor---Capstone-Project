import { StatusCodes } from "http-status-codes";
import { URL, URLClick } from "../prisma/db";
import ErrorParent, {
	BadrequestError,
	InternalServerError,
	NotFoundError,
} from "../middlewears/error";
import argon from "argon2";
import axios from "axios";
import config from "../config";
import { upload } from "../middlewears/cloudinary_uploader";
import Wrapper from "../middlewears/wrapper";

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

		if (!data.expiration_date) {
			const threeMonthsFromNow = new Date();
			threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

			data.expiration_date = threeMonthsFromNow;
		}

		if (!this.isWithinSixMonths(new Date(data.expiration_date)))
			throw new BadrequestError(
				"Expiration date must be within 6 months."
			);

		if (data.password) {
			hashed_password = await this.hashPassword(data.password);
		}

		const QR_CODE = await this.generateQRCode(
			config.BASE_URL + data.short_url
		);

		const url = await URL.create({
			data: {
				short_url: data.short_url,
				long_url: data.long_url,
				expiration_date: new Date(data.expiration_date),
				password: hashed_password,
				owner_id: data.user_id && data.user_id,
				qr_code:
					QR_CODE !== undefined
						? {
								url: QR_CODE.secure_url,
								id: QR_CODE.public_id,
						  }
						: undefined,
			},
		});

		// TODO: QR Code generation to be handled by background workers
		// TODO: Let workers handle this
		if (config.OPTIONS.SCAN_URLS)
			await this.updateUrlInfo(data.long_url, url.id);

		return url;
	};

	public getMany = async (user_id: string, opts: any) => {
		const { page = 1, limit = 10 } = opts;

		const data = await URL.findMany({
			where: {
				owner_id: user_id,
			},
			select: {
				id: true,
				short_url: true,
				long_url: true,
				created_at: true,
				expiration_date: true,
				is_safe: true,
				clicks: {
					orderBy: {
						created_at: "desc",
					},
					select: {
						id: true,
						ip: true,
						is_unique: true,
						browser: true,
						OS: true,
						created_at: true,
						city: true,
						country: true,
						region: true,
						timezone: true,
						lat: true,
						lon: true,
						ip_type: true,
					},
				},
				qr_code: true,
				last_visited: true,
				_count: true,
			},
			orderBy: {
				created_at: "desc",
			},
			take: limit,
			skip: (page - 1) * limit,
		});

		return data;
	};

	public visit = async (id: string, user_info: any) => {
		const { ip, browser, os } = user_info;
		// TODO:
		// -   password

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
							? os.name.toString() + " | " + os.version
							: undefined,
				},
			});

			// Update user IP info in background worker
			// TODO: Let workers handle this
			if (config.OPTIONS.UPDATE_USER_IP_INFO)
				await this.updateUserIpInfo(ip, url_click.id);

			return { url: url.long_url, is_safe: url.is_safe };
		} catch (error: any) {
			// console.log(error);
			if (error.code === "P2025") {
				throw new NotFoundError("URL does not exists");
			}
			throw new InternalServerError(error.message);
		}
	};

	public getOne = async (user_id: string, url_id: string) => {
		try {
			const url = await URL.findUniqueOrThrow({
				where: { id: url_id, owner_id: user_id },
			});

			return url;
		} catch (error: any) {
			if (error.code === "P2025")
				throw new NotFoundError("URL does not exists");
			throw new InternalServerError(error.message);
		}
	};

	public update = async (url_id: string, user_id: string, data: any) => {
		if (data.long_url && !this.isValidURL(data.long_url))
			throw new BadrequestError("Invalid URL provided.");

		if (
			data.short_url &&
			!(
				data.short_url.length >= 5 &&
				(data.short_url as string).length <= 8
			)
		) {
			throw new BadrequestError(
				"Short URL must be between 5-8 characters."
			);
		}
		if (data.password) {
			data.password = await this.hashPassword(data.password);
		}

		const url = await URL.update({
			where: {
				id: url_id,
				owner_id: user_id,
			},
			data: {
				long_url: data.long_url && data.long_url,
				password: data.password && data.password,
				short_url: data.short_url && data.short_url,
			},
		});

		return url;
	};

	public delete = async (id: string, user_id: string) => {
		try {
			await URL.delete({
				where: {
					id,
					owner_id: user_id,
				},
			});
			return 0;
		} catch (error: any) {
			if (error.code === "P2025")
				throw new NotFoundError("URL does not exists");
			throw new InternalServerError(error.message);
		}
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

	private updateUrlInfo = async (long_url: string, url_id: string) => {
		try {
			const {
				data: { data },
			} = await axios.post(
				"https://www.virustotal.com/api/v3/urls",
				{ url: long_url },
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/x-www-form-urlencoded",
						"x-apikey": config.TOKENS.VIRUSTOTAL_API_KEY,
					},
				}
			);
			const {
				data: { data: analyses_data },
			} = await axios.get(
				`https://www.virustotal.com/api/v3/analyses/${data.id}`,
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"x-apikey": config.TOKENS.VIRUSTOTAL_API_KEY,
					},
				}
			);

			const { malicious, suspicious } = analyses_data.attributes.stats;

			await URL.update({
				where: { id: url_id },
				data: {
					is_safe: malicious === 0 && suspicious === 0 ? true : false,
				},
			});
			return 0;
		} catch (error: any) {
			console.log("Error updating URLINFO", error.message);
			console.log(error);
		}
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
				// url_id,
				created_at: {
					gte: new Date(
						new Date().getTime() - 1000 * 60 * 60 * 24 * 7
					),
				}, // 7 days
			},
		});
		return url_click ? false : true;
	};

	private generateQRCode = async (url: string) => {
		console.log(url);
		const qr = await axios.get(
			"http://api.qrserver.com/v1/create-qr-code",
			{
				responseType: "text",
				params: {
					data: url,
					size: "150x150",
					format: "svg",
					qzone: 2,
					color: "50-15-0",
				},
			}
		);
		console.log(1);

		const uploaded = await upload({
			file: Buffer.from(qr.data),
			opts: {
				path: "",
				format: "svg",
			},
		});
		return uploaded;
	};

	private updateUserIpInfo = async (ip: string, url_click_id: string) => {
		try {
			const request = await axios.get(
				`http://api.weatherapi.com/v1/ip.json`,
				{
					params: {
						key: config.TOKENS.WEATHER_API,
						q: ip,
					},
				}
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
				console.log("Fetch Error - UpdateUserIPInfo", error.message);
				console.log(error);
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
