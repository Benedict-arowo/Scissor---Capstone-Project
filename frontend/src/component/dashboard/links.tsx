import { findFlagUrlByCountryName } from "country-flags-svg";
import { useEffect, useRef, useState } from "react";
import Config from "../../utils";
import { format } from "timeago.js";
import { Toast } from "primereact/toast";

const Links = () => {
	const [items, setItems] = useState<IURL[]>([]);
	const [err, setErr] = useState("");
	const toast = useRef<Toast>(null);

	const FetchLinks = async () => {
		const response = await fetch(`${Config.API_URL}/url`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		});

		if (!response.ok) {
			const data = await response.json();

			setErr(data.message);
			throw new Error(data ? data.message : "Error fetching your urls!");
		}

		const data = await response.json();

		setItems(() =>
			data.data.map((item: IURL) => ({ ...item, isCollapsed: true }))
		);
	};

	const DeleteURL = async (id: string, button: HTMLButtonElement) => {
		toast.current?.show({
			severity: "info",
			summary: "Deleting URL...",
		});
		const response = await fetch(`${Config.API_URL}/url/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		});

		if (!response.ok) {
			const data = await response.json();
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: data ? data.message : "Error deleting url!",
			});
			button.disabled = false;
			throw new Error(data ? data.message : "Error deleting url!");
		}

		toast.current?.show({
			severity: "success",
			summary: "Success",
			detail: "Successfully deleted URL.",
		});

		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const GenerateQRCode = async (id: string, button: HTMLButtonElement) => {
		toast.current?.show({
			severity: "info",
			summary: "Generating QRCode...",
		});
		const response = await fetch(`${Config.API_URL}/url/${id}/qrcode`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		});

		const data = await response.json();

		if (!response.ok) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: data ? data.message : "Error fetching your urls!!",
			});
			button.disabled = false;
			throw new Error(data ? data.message : "Error fetching your urls!");
		}

		toast.current?.show({
			severity: "success",
			summary: "Success",
			detail: "Successfully generated QRCode.",
		});

		setItems(() =>
			items.map((item) => {
				if (item.id === id) {
					return { ...item, qr_code: data.data };
				}
				return item;
			})
		);
	};

	useEffect(() => {
		FetchLinks();
	}, []);

	return (
		<div className="m-8">
			<Toast ref={toast} />
			<header className="flex flex-row justify-between items-center">
				<h3 className="font-semibold text-2xl">Links</h3>
				<button className="px-6 w-fit bg-violet-600 py-1.5 text-white rounded-lg">
					New
				</button>
			</header>
			<section className="mt-12 flex flex-col gap-1">
				{err && (
					<h6 className="w-full text-center text-red-500">{err}</h6>
				)}
				{!err && items.length === 0 && (
					<h6 className="w-full text-center text-gray-500">
						Ooops... This place is looking real dry. Mind fixing
						that using that purple button?
					</h6>
				)}
				{!err &&
					items.map((item) => {
						const { id } = item;
						return (
							<article
								key={id}
								className="w-full px-6 py-2 items-center border border-green-500">
								<div className="flex flex-row items-center justify-between">
									<div className="flex flex-col gap-0">
										<a
											href={`${Config.BASE_URL}/${item.short_url}`}
											target="_blank"
											className="">
											/{item.short_url}
										</a>
										<span className="text-xs text-gray-400 font-light m-0">
											Created {format(item.created_at)}
										</span>
									</div>
									{item.last_visited && (
										<p className="text-gray-400 text-sm font-light">
											Last Visited{" "}
											{format(item.last_visited)}
										</p>
									)}
									<div
										onClick={() =>
											setItems((items) => {
												return items.map((item) => {
													return item.id === id
														? {
																...item,
																isCollapsed:
																	!item.isCollapsed,
																// eslint-disable-next-line no-mixed-spaces-and-tabs
														  }
														: item;
												});
											})
										}
										className="cursor-pointer">
										{item.isCollapsed && (
											<i
												className="font-semibold text-xs pi up
pi-arrow-down"></i>
										)}
										{!item.isCollapsed && (
											<i
												className="font-semibold text-xs pi up
pi-arrow-up"></i>
										)}
									</div>
								</div>
								{!item.isCollapsed && (
									<div className="flex flex-row gap-8 my-4 max-h-[200px] h-full">
										{/* barcode */}
										<div className="w-[200px] h-[200px] bg-gray-400 grid place-content-center border border-gray-600">
											{!item.qr_code && (
												<button
													onClick={(e) => {
														e.currentTarget.disabled =
															true;
														// TODO: Disable the button for 5 seconds
														GenerateQRCode(
															id,
															e.currentTarget
														);
													}}
													className="px-4 w-full mx-auto text-sm bg-green-500 py-2 text-white rounded-lg ">
													GENERATE QRCODE
												</button>
											)}
											{item.qr_code && (
												<img
													className="w-[300px]"
													src={item.qr_code?.url}
													alt="QRCode"
												/>
											)}
										</div>
										<div className="flex-1 flex flex-row gap-6">
											<div>
												<fieldset className="flex flex-col gap-1 flex-1">
													<label
														htmlFor="domain"
														className="font-semibold text-lg">
														URL
													</label>
													<input
														className="py-2 px-4 rounded-md border bg-gray-200 border-gray-500 focus:outline-none w-fit"
														type="text"
														name="domain"
														id="domain"
														disabled
														value={item.long_url}
														// value={domain}
													/>
												</fieldset>
												<div className="mt-3 ">
													<p className="text-lg font-semibold text-gray-500">
														<span className="text-violet-400">
															{item.clicks.length}
														</span>{" "}
														Clicks
													</p>
													<p className="text-lg font-semibold text-gray-500">
														<span className="text-violet-400">
															{
																item.clicks.filter(
																	(click) =>
																		click.is_unique
																			? true
																			: false
																).length
															}
														</span>{" "}
														Unique Clicks
													</p>
													<button
														onClick={(e) =>
															DeleteURL(
																item.id,
																e.currentTarget
															)
														}
														className="px-4 w-fit bg-red-500 py-2 text-white rounded-lg mt-5">
														Delete URL
													</button>
												</div>
											</div>
											<div className="w-full max-h-full overflow-y-auto">
												<ul className="w-full flex flex-col gap-1">
													{item.clicks.map(
														(click) => {
															return (
																<li
																	key={
																		click.id
																	}
																	className="border py-1 px-2 flex flex-row justify-between items-center w-full">
																	<div className="flex flex-row gap-3">
																		<img
																			src={findFlagUrlByCountryName(
																				click.country ||
																					""
																			)}
																			width={
																				32
																			}
																			height={
																				32
																			}></img>
																		<h6 className="font-medium">
																			{
																				click.city
																			}
																		</h6>
																	</div>
																	<p className="text-gray-500">
																		{
																			click.ip
																		}
																	</p>
																	<p className="text-gray-500">
																		{
																			click.OS
																		}
																	</p>
																	<p className="text-gray-500">
																		{
																			click.browser
																		}
																	</p>
																</li>
															);
														}
													)}
												</ul>
											</div>
										</div>
									</div>
								)}
							</article>
						);
					})}
			</section>
		</div>
	);
};

export default Links;
interface IURL {
	id: string;
	short_url: string;
	long_url: string;
	created_at: Date;
	expiration_date: Date;
	is_safe: boolean;
	clicks: {
		id: string;
		ip: string;
		is_unique: boolean;
		browser: string;
		OS: string;
		created_at: Date;
		city: null | string;
		country: null | string;
		region: null | string;
		timezone: null | string;
		lat: null | string;
		lon: null | string;
		ip_type: null | string;
	}[];
	qr_code: null | { id: string; url: string };
	last_visited: null | Date;
	isCollapsed: boolean;
	_count: {
		clicks: number;
	};
}
