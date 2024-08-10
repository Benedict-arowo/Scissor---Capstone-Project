"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const App_tsx_1 = __importDefault(require("./App.tsx"));
require("./index.css");
const api_1 = require("primereact/api");
require("primereact/resources/themes/lara-light-cyan/theme.css");
const react_router_dom_1 = require("react-router-dom");
client_1.default.createRoot(document.getElementById("root")).render(<react_1.default.StrictMode>
		<api_1.PrimeReactProvider>
			<react_router_dom_1.BrowserRouter>
				<App_tsx_1.default />
			</react_router_dom_1.BrowserRouter>
		</api_1.PrimeReactProvider>
	</react_1.default.StrictMode>);
