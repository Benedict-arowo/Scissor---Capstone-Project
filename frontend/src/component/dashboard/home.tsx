import { findFlagUrlByCountryName } from "country-flags-svg";

const home = () => {
	return (
		<div className="m-8 max-w-full overflow-hidden">
			<header className="w-full flex h-[130px] flex-row gap-8 justify-center">
				<div className="w-full h-full rounded-md bg-violet-600 flex flex-col justify-between p-4 border border-gray-500 shadow-md">
					<p className="text-6xl font-light text-white">300</p>
					<p className="self-end place-self-end text-5xl font-bold">
						URLS
					</p>
				</div>

				<div className="w-full h-full rounded-md bg-green-600 flex flex-col justify-between p-4 border border-gray-500 shadow-md">
					<p className="text-6xl font-light text-white">300</p>
					<p className="self-end place-self-end text-5xl font-bold">
						CLICKS
					</p>
				</div>

				<div className="w-full h-full rounded-md bg-yellow-600 flex flex-col justify-between p-4 border border-gray-500 shadow-md">
					<p className="text-6xl font-light text-white">30+</p>
					<p className="self-end place-self-end text-5xl font-bold">
						COUNTRIES
					</p>
				</div>
			</header>

			<main className="mt-8">
				<section className="w-[500px] mt-4 border border-gray-300 rounded-sm overflow-hidden pb-2 min-h-[200px]">
					<h3 className="w-full bg-violet-500 text-white px-2 py-1 border border-violet-600 rounded-sm mb-2">
						Top Urls
					</h3>
					<ul className="flex flex-col gap-2 px-3">
						<li className="flex flex-row justify-between">
							<a href="" className="underline">
								/uggbu1
							</a>
							<p className="font-light">300 Clicks</p>
							<p className="text-gray-400 font-light text-sm">
								30 days ago
							</p>
						</li>{" "}
						<li className="flex flex-row justify-between">
							<a href="" className="underline">
								/uggbu1
							</a>
							<p className="font-light">300 Clicks</p>
							<p className="text-gray-400 font-light text-sm">
								30 days ago
							</p>
						</li>
						<li className="flex flex-row justify-between">
							<a href="" className="underline">
								/uggbu1
							</a>
							<p className="font-light">300 Clicks</p>
							<p className="text-gray-400 font-light text-sm">
								30 days ago
							</p>
						</li>
						<li className="flex flex-row justify-between">
							<a href="" className="underline">
								/uggbu1
							</a>
							<p className="font-light">300 Clicks</p>
							<p className="text-gray-400 font-light text-sm">
								30 days ago
							</p>
						</li>
						<li className="flex flex-row justify-between">
							<a href="" className="underline">
								/uggbu1
							</a>
							<p className="font-light">300 Clicks</p>
							<p className="text-gray-400 font-light text-sm">
								30 days ago
							</p>
						</li>
					</ul>
				</section>

				<section className="w-[500px] mt-4  border border-gray-300 rounded-sm overflow-hidden pb-2 min-h-[150px]">
					<h3 className="w-full bg-violet-500 text-white px-2 py-1 border border-violet-600 rounded-sm mb-2">
						Top Countries
					</h3>
					<ul className="flex flex-col gap-2 px-3">
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img
									src={findFlagUrlByCountryName("Nigeria")}
									alt=""
									width={40}
								/>
								<h6>Nigeria</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img
									src={findFlagUrlByCountryName("Sudan")}
									alt=""
									width={40}
								/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img
									src={findFlagUrlByCountryName("Sudan")}
									alt=""
									width={40}
								/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img
									src={findFlagUrlByCountryName("Sudan")}
									alt=""
									width={40}
								/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img
									src={findFlagUrlByCountryName("Sudan")}
									alt=""
									width={40}
								/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
					</ul>
				</section>
			</main>
		</div>
	);
};

export default home;
