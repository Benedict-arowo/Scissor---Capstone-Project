"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const links_1 = __importDefault(require("../component/dashboard/links"));
const token_1 = __importDefault(require("../component/dashboard/token"));
const home_1 = __importDefault(require("../component/dashboard/home"));
const react_router_dom_1 = require("react-router-dom");
const Dashboard = () => {
    const { search } = (0, react_router_dom_1.useLocation)();
    const query = new URLSearchParams(search);
    const activePage = query.get("page") === "home" ||
        query.get("page") === "links" ||
        query.get("page") === "token"
        ? query.get("page")
        : "home";
    const [active, setActive] = (0, react_1.useState)(activePage);
    const activeStyle = "text-white bg-violet-500";
    return (<div className="flex flex-row w-full h-screen">
			<aside className="w-[230px] bg-white border-r-2 border-gray-100 flex flex-col gap-4 pt-12 px-3">
				<react_router_dom_1.Link to="/dashboard?page=home" onClick={() => setActive("home")} className={`px-6 w-full py-2 rounded-md ${active === "home" ? activeStyle : "text-black"}`}>
					Home
				</react_router_dom_1.Link>
				<react_router_dom_1.Link to="/dashboard?page=links" onClick={() => setActive("links")} className={`px-6 w-full py-2 rounded-md ${active === "links" ? activeStyle : "text-black"}`}>
					Links
				</react_router_dom_1.Link>
				<react_router_dom_1.Link to="/dashboard?page=token" onClick={() => setActive("token")} className={`px-6 w-full py-2 rounded-md ${active === "token" ? activeStyle : "text-black"}`}>
					Token
				</react_router_dom_1.Link>
			</aside>
			<main className="flex-1">
				{active === "home" && <home_1.default />}
				{active === "links" && <links_1.default />}
				{active === "token" && <token_1.default />}
			</main>
		</div>);
};
exports.default = Dashboard;
