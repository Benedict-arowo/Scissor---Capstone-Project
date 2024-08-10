"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const country_flags_svg_1 = require("country-flags-svg");
const utils_1 = __importDefault(require("../../utils"));
const react_1 = require("react");
const Home = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [err, setErr] = (0, react_1.useState)(undefined);
    const FetchLinks = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`${utils_1.default.API_URL}/url`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (!response.ok) {
            const data = yield response.json();
            setErr(data.message);
            throw new Error(data ? data.message : "Error fetching your urls!");
        }
        const data = yield response.json();
        setItems(() => data.data.map((item) => (Object.assign(Object.assign({}, item), { isCollapsed: true }))));
    });
    (0, react_1.useEffect)(() => {
        FetchLinks();
    }, []);
    return (<div className="m-8 max-w-full overflow-hidden">
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
								<img src={(0, country_flags_svg_1.findFlagUrlByCountryName)("Nigeria")} alt="" width={40}/>
								<h6>Nigeria</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img src={(0, country_flags_svg_1.findFlagUrlByCountryName)("Sudan")} alt="" width={40}/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img src={(0, country_flags_svg_1.findFlagUrlByCountryName)("Sudan")} alt="" width={40}/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img src={(0, country_flags_svg_1.findFlagUrlByCountryName)("Sudan")} alt="" width={40}/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
						<li className="flex flex-row justify-between">
							<div className="flex flex-row gap-2">
								<img src={(0, country_flags_svg_1.findFlagUrlByCountryName)("Sudan")} alt="" width={40}/>
								<h6>Sudan</h6>
							</div>
							<p>35</p>
						</li>
					</ul>
				</section>
			</main>
		</div>);
};
exports.default = Home;
