import { findFlagUrlByCountryName } from "country-flags-svg";
import React, { useState } from "react";

const Links = () => {
	const [items, setItems] = useState([
		{ id: 1, isCollapsed: true },
		{ id: 2, isCollapsed: true },
	]);

	return (
		<div className="m-8">
			<header className="flex flex-row justify-between items-center">
				<h3 className="font-semibold text-2xl">Links</h3>
				<button className="px-6 w-fit bg-violet-600 py-1.5 text-white rounded-lg">
					New
				</button>
			</header>
			<section className="mt-12 flex flex-col gap-1">
				{items.map((item) => {
					const { id } = item;
					return (
						<article className="w-full px-6 py-2 items-center border border-green-500">
							<div className="flex flex-row items-center justify-between">
								<div className="flex flex-col gap-0">
									<p className="">/bhjjs1</p>
									<span className="text-xs text-gray-400 font-light m-0">
										14/06/2024
										{/* Created time */}
									</span>
								</div>
								<p className="text-gray-400 text-sm font-light">
									Visited 20 minutes ago
								</p>
								<div
									onClick={() =>
										setItems((items) => {
											return items.map((item) => {
												return item.id === id
													? {
															...item,
															isCollapsed:
																!item.isCollapsed,
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
								<div className="flex flex-row gap-8 my-4">
									{/* barcode */}
									<div className="w-[200px] h-[200px] bg-gray-400 grid place-content-center border border-gray-600">
										<button className="px-4 w-full mx-auto text-sm bg-green-500 py-2 text-white rounded-lg ">
											GENERATE QRCODE
										</button>
										{/* <img
											className="w-[300px]"
											src=""
											alt=""
										/> */}
									</div>
									<div className="flex-1 flex flex-row gap-6">
										<div>
											<fieldset className="flex flex-col gap-1 flex-1">
												<label
													htmlFor="domain"
													className="font-semibold text-lg">
													ALIAS
												</label>
												<input
													className="py-2 px-4 rounded-md border bg-gray-200 border-gray-500 focus:outline-none w-fit"
													type="text"
													name="domain"
													id="domain"
													disabled
													value={"/uughhh"}
													// value={domain}
												/>
											</fieldset>
											<div className="mt-3">
												<p className="text-lg font-semibold text-gray-500">
													<span className="text-violet-400">
														300
													</span>{" "}
													Clicks
												</p>
												<p className="text-lg font-semibold text-gray-500">
													<span className="text-violet-400">
														120
													</span>{" "}
													Unique Clicks
												</p>
												<button className="px-4 w-fit bg-red-500 py-2 text-white rounded-lg mt-5">
													Delete URL
												</button>
											</div>
										</div>
										<div className="w-full">
											<ul className="w-full flex flex-col gap-1">
												<li className="border py-1 px-2 flex flex-row justify-between items-center w-full">
													<div className="flex flex-row gap-3">
														<img
															src={findFlagUrlByCountryName(
																"Nigeria"
															)}
															width={32}
															height={32}></img>
														<h6 className="font-medium">
															Lagos
														</h6>
													</div>
													<p className="text-gray-500">
														192.168.0.233
													</p>
													<p className="text-gray-500">
														Windows 10.0
													</p>
													<p className="text-gray-500">
														Chrome V3.0
													</p>
												</li>
												<li className="border py-1 px-2 flex flex-row justify-between items-center w-full">
													<div className="flex flex-row gap-3">
														<img
															src={findFlagUrlByCountryName(
																"Sudan"
															)}
															width={32}
															height={32}></img>
														<h6 className="font-medium">
															Lagos
														</h6>
													</div>
													<p className="text-gray-500">
														192.168.0.233
													</p>
													<p className="text-gray-500">
														Windows 10.0
													</p>
													<p className="text-gray-500">
														Chrome V3.0
													</p>
												</li>
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

// id String @id @default(cuid())
// short_url String @unique
// long_url String
// expiration_date DateTime
// qr_code Json?
// password String?
// is_safe Boolean @default(false)
// clicks UrlClick[]
// last_visited DateTime?
// owner User? @relation(fields: [owner_id], references: [email], onDelete: Cascade)
// owner_id String?
// created_at DateTime @default(now())
