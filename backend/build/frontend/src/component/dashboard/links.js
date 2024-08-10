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
const react_1 = require("react");
const utils_1 = __importDefault(require("../../utils"));
const timeago_js_1 = require("timeago.js");
const toast_1 = require("primereact/toast");
const Links = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [err, setErr] = (0, react_1.useState)("");
    const toast = (0, react_1.useRef)(null);
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
    const DeleteURL = (id, button) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        (_a = toast.current) === null || _a === void 0 ? void 0 : _a.show({
            severity: "info",
            summary: "Deleting URL...",
        });
        const response = yield fetch(`${utils_1.default.API_URL}/url/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (!response.ok) {
            const data = yield response.json();
            (_b = toast.current) === null || _b === void 0 ? void 0 : _b.show({
                severity: "error",
                summary: "Error",
                detail: data ? data.message : "Error deleting url!",
            });
            button.disabled = false;
            throw new Error(data ? data.message : "Error deleting url!");
        }
        (_c = toast.current) === null || _c === void 0 ? void 0 : _c.show({
            severity: "success",
            summary: "Success",
            detail: "Successfully deleted URL.",
        });
        setItems((prev) => prev.filter((item) => item.id !== id));
    });
    const GenerateQRCode = (id, button) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        (_a = toast.current) === null || _a === void 0 ? void 0 : _a.show({
            severity: "info",
            summary: "Generating QRCode...",
        });
        const response = yield fetch(`${utils_1.default.API_URL}/url/${id}/qrcode`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        const data = yield response.json();
        if (!response.ok) {
            (_b = toast.current) === null || _b === void 0 ? void 0 : _b.show({
                severity: "error",
                summary: "Error",
                detail: data ? data.message : "Error fetching your urls!!",
            });
            button.disabled = false;
            throw new Error(data ? data.message : "Error fetching your urls!");
        }
        (_c = toast.current) === null || _c === void 0 ? void 0 : _c.show({
            severity: "success",
            summary: "Success",
            detail: "Successfully generated QRCode.",
        });
        setItems(() => items.map((item) => {
            if (item.id === id) {
                return Object.assign(Object.assign({}, item), { qr_code: data.data });
            }
            return item;
        }));
    });
    (0, react_1.useEffect)(() => {
        FetchLinks();
    }, []);
    return (<div className="m-8">
			<toast_1.Toast ref={toast}/>
			<header className="flex flex-row justify-between items-center">
				<h3 className="font-semibold text-2xl">Links</h3>
				<button className="px-6 w-fit bg-violet-600 py-1.5 text-white rounded-lg">
					New
				</button>
			</header>
			<section className="mt-12 flex flex-col gap-1">
				{err && (<h6 className="w-full text-center text-red-500">{err}</h6>)}
				{!err && items.length === 0 && (<h6 className="w-full text-center text-gray-500">
						Ooops... This place is looking real dry. Mind fixing
						that using that purple button?
					</h6>)}
				{!err &&
            items.map((item) => {
                var _a;
                const { id } = item;
                return (<article key={id} className="w-full px-6 py-2 items-center border border-green-500">
								<div className="flex flex-row items-center justify-between">
									<div className="flex flex-col gap-0">
										<a href={`${utils_1.default.BASE_URL}/${item.short_url}`} target="_blank" className="">
											/{item.short_url}
										</a>
										<span className="text-xs text-gray-400 font-light m-0">
											Created {(0, timeago_js_1.format)(item.created_at)}
										</span>
									</div>
									{item.last_visited && (<p className="text-gray-400 text-sm font-light">
											Last Visited{" "}
											{(0, timeago_js_1.format)(item.last_visited)}
										</p>)}
									<div onClick={() => setItems((items) => {
                        return items.map((item) => {
                            return item.id === id
                                ? Object.assign(Object.assign({}, item), { isCollapsed: !item.isCollapsed }) : item;
                        });
                    })} className="cursor-pointer">
										{item.isCollapsed && (<i className="font-semibold text-xs pi up
pi-arrow-down"></i>)}
										{!item.isCollapsed && (<i className="font-semibold text-xs pi up
pi-arrow-up"></i>)}
									</div>
								</div>
								{!item.isCollapsed && (<div className="flex flex-row gap-8 my-4 max-h-[200px] h-full">
										{/* barcode */}
										<div className="w-[200px] h-[200px] bg-gray-400 grid place-content-center border border-gray-600">
											{!item.qr_code && (<button onClick={(e) => {
                                e.currentTarget.disabled =
                                    true;
                                // TODO: Disable the button for 5 seconds
                                GenerateQRCode(id, e.currentTarget);
                            }} className="px-4 w-full mx-auto text-sm bg-green-500 py-2 text-white rounded-lg ">
													GENERATE QRCODE
												</button>)}
											{item.qr_code && (<img className="w-[300px]" src={(_a = item.qr_code) === null || _a === void 0 ? void 0 : _a.url} alt="QRCode"/>)}
										</div>
										<div className="flex-1 flex flex-row gap-6">
											<div>
												<fieldset className="flex flex-col gap-1 flex-1">
													<label htmlFor="domain" className="font-semibold text-lg">
														URL
													</label>
													<input className="py-2 px-4 rounded-md border bg-gray-200 border-gray-500 focus:outline-none w-fit" type="text" name="domain" id="domain" disabled value={item.long_url}/>
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
															{item.clicks.filter((click) => click.is_unique
                            ? true
                            : false).length}
														</span>{" "}
														Unique Clicks
													</p>
													<button onClick={(e) => DeleteURL(item.id, e.currentTarget)} className="px-4 w-fit bg-red-500 py-2 text-white rounded-lg mt-5">
														Delete URL
													</button>
												</div>
											</div>
											<div className="w-full max-h-full overflow-y-auto">
												<ul className="w-full flex flex-col gap-1">
													{item.clicks.map((click) => {
                            return (<li key={click.id} className="border py-1 px-2 flex flex-row justify-between items-center w-full">
																	<div className="flex flex-row gap-3">
																		<img src={(0, country_flags_svg_1.findFlagUrlByCountryName)(click.country ||
                                    "")} width={32} height={32}></img>
																		<h6 className="font-medium">
																			{click.city}
																		</h6>
																	</div>
																	<p className="text-gray-500">
																		{click.ip}
																	</p>
																	<p className="text-gray-500">
																		{click.OS}
																	</p>
																	<p className="text-gray-500">
																		{click.browser}
																	</p>
																</li>);
                        })}
												</ul>
											</div>
										</div>
									</div>)}
							</article>);
            })}
			</section>
		</div>);
};
exports.default = Links;
