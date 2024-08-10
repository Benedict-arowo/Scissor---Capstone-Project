"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nav_1 = __importDefault(require("./component/nav"));
const pages_1 = __importDefault(require("./pages"));
const auth_1 = __importDefault(require("./pages/auth"));
const dashboard_1 = __importDefault(require("./pages/dashboard"));
const react_router_dom_1 = require("react-router-dom");
require("primeicons/primeicons.css");
const App = () => {
    return (<>
			<nav_1.default />
			<react_router_dom_1.Routes>
				<react_router_dom_1.Route path="/" element={<pages_1.default />}/>
				<react_router_dom_1.Route path="/auth" element={<auth_1.default />}/>
				<react_router_dom_1.Route path="/dashboard" element={<dashboard_1.default />}/>
			</react_router_dom_1.Routes>
		</>);
};
exports.default = App;
