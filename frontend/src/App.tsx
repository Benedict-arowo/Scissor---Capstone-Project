import Nav from "./component/nav";
function App() {
	const domain = "bitly.cx/";
	const countries = [
		"United States",
		"Canada",
		"France",
		"Germany",
		"United Kingdom",
		"Nigeria",
	];

	return (
		<div className="h-full bg-white">
			<Nav />
			<main className="h-full min-h-screen">
				<section className="pt-36 flex flex-col items-center">
					<h1 className="text-5xl font-bold text-center">
						Smart and powerful short links
					</h1>
					<p className="font-base mt-4 text-gray-500 text-xl text-center">
						Stay in control of your links with advanced features for
						shortening and tracking.
					</p>

					<section className="w-full max-w-[600px]">
						<div className="flex flex-row justify-center gap-2 mt-8 w-full">
							<input
								className="py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 max-w-[500px] w-full"
								placeholder="http://www.example.com/something?cool=true"
								type="url"
								name="url"
								id="url"
							/>
							<button
								type="submit"
								className="px-6 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-md font-semibold text-lg text-white duration-300 transition-all">
								Shorten
							</button>
						</div>

						<div className="flex flex-row justify-between gap-8 mt-6 w-full">
							<fieldset className="flex flex-col gap-1 flex-1">
								<label htmlFor="domain">Domain</label>
								<input
									className="py-2 px-4 rounded-md border bg-gray-200 border-gray-500 focus:outline-none focus:border-violet-600 transition duration-300 w-full"
									type="text"
									name="domain"
									id="domain"
									disabled
									value={domain}
								/>
							</fieldset>

							<fieldset className="flex flex-col gap-1 flex-1">
								<label htmlFor="alias">Alias (optional)</label>
								<input
									className="py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full"
									type="text"
									name="alias"
									id="alias"
									minLength={5}
									maxLength={8}
								/>
							</fieldset>
						</div>
					</section>
				</section>

				<section className="mt-64 flex justify-center">
					<section className="flex flex-row gap-12">
						<div>
							<h3 className="font-bold text-3xl">
								Link management
							</h3>
							<p className="text-gray-500 mt-2 text-lg max-w-[450px]">
								Complete link management platform to brand,
								track and share your short links.
							</p>

							<div className="flex flex-row gap-4 mt-8">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="size-14 text-violet-700 px-4 py-4 bg-violet-200 rounded-2xl">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
									/>
								</svg>

								<div>
									<h4 className="font-semibold text-2xl">
										Links
									</h4>
									<p className="font-light text-gray-500">
										Shorten and share your links with our
										advanced set of features.
									</p>
								</div>
							</div>
						</div>
						<aside className="flex flex-col gap-3">
							{[1, 2, 3, 4, 5].map(() => (
								<div className="flex flex-row items-center justify-between w-[500px] bg-white px-4 py-3 rounded-lg shadow-md cursor-default">
									<div className="flex flex-col gap-0">
										<p className="text-violet-600">
											{domain}b5csx
										</p>
										<span className="text-gray-500">
											Cibsectetur - Adipiscing
										</span>
									</div>

									<div className="flex flex-row gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6 text-violet-600">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
											/>
										</svg>

										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6 text-violet-600">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
											/>
										</svg>
									</div>
								</div>
							))}
						</aside>
					</section>
				</section>

				<section className="flex flex-row justify-center gap-12 mt-32 bg-gray-100 py-12">
					<aside className="flex flex-col gap-2">
						{[1, 2, 3, 4, 5].map(() => (
							<div className="flex flex-row items-start justify-between w-[500px] bg-white px-4 py-3 rounded-lg shadow-md cursor-default">
								<div className="flex flex-col gap-0 w-full">
									{
										countries[
											Math.floor(
												Math.random() * countries.length
											)
										]
									}
									<progress
										className="h-1.5 rounded-full mt-2 custom_progress w-full "
										value={Math.random() * 100}
										max={100}></progress>
								</div>
								<p>{Math.floor(Math.random() * 50)}</p>
							</div>
						))}
					</aside>
					<div>
						<h3 className="font-bold text-3xl">Statistics</h3>
						<p className="text-gray-500 mt-2 text-lg max-w-[450px]">
							Get to know your audience with our detailed
							statistics and better understand the performance of
							your links, while also being GDPR, CCPA and PECR
							compliant.
						</p>

						<div className="flex flex-row mt-8 gap-x-24 gap-y-4 flex-wrap max-w-[350px]">
							<p className="font-semibold text-lg">
								<span>I</span>Overview
							</p>
							<p className="font-semibold text-lg">
								<span>I</span>Devices
							</p>
							<p className="font-semibold text-lg">
								<span>I</span>Browsers
							</p>
							<p className="font-semibold text-lg">
								<span>I</span>Countries
							</p>
							<p className="font-semibold text-lg">
								<span>I</span>Languages
							</p>
							<p className="font-semibold text-lg">
								<span>I</span>Cities
							</p>
							<p className="font-semibold text-lg">
								<span>I</span>Referrers
							</p>
							<p className="font-semibold text-lg">
								<span>I</span>Platforms
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;
