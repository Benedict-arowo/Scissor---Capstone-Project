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
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const utils_1 = __importDefault(require("../utils"));
const toast_1 = require("primereact/toast");
const Auth = () => {
    const toast = (0, react_1.useRef)(null);
    const { search } = (0, react_router_dom_1.useLocation)();
    const Navigate = (0, react_router_dom_1.useNavigate)();
    const query = new URLSearchParams(search);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [mode, setMode] = (0, react_1.useState)(query.get("mode") === "login" ? "login" : "signup");
    const [credentials, setCredentials] = (0, react_1.useState)({
        email: "",
        password: "",
    });
    const Authenticate = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
            throw new Error("Please fill in all the fields!");
        }
        const response = yield fetch(`${utils_1.default.API_URL}/auth/${mode === "login" ? "login" : "register"}`, {
            body: JSON.stringify(credentials),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = yield response.json();
        if (!response.ok) {
            (_a = toast.current) === null || _a === void 0 ? void 0 : _a.show({
                severity: "error",
                summary: "Error",
                detail: data ? data.message : "Failed to authenticate!",
            });
            throw new Error(data ? data.message : "Failed to authenticate!");
        }
        if (mode === "signup") {
            (_b = toast.current) === null || _b === void 0 ? void 0 : _b.show({
                severity: "success",
                summary: "Success",
                detail: "Successful registration!",
            });
            // Display signup successfull
            setMode("login");
        }
        (_c = toast.current) === null || _c === void 0 ? void 0 : _c.show({
            severity: "success",
            summary: "Success",
            detail: "Successfully logged you in!",
        });
        const { data: { access_token }, } = data;
        localStorage.setItem("access_token", access_token);
        setTimeout(() => {
            Navigate("/dashboard");
        }, 1000);
    });
    return (<div className="grid place-content-center">
			<toast_1.Toast ref={toast}/>
			<header className="mt-12 mx-auto">
				<h2 className="w-full text-center font-medium text-5xl text-violet-600">
					{mode === "login" ? "Login" : "Sign Up"}
				</h2>
				<p className="text-gray-600 w-full text-center font-light mt-1">
					{mode === "login"
            ? "Enter your details to be logged into your account!"
            : "Enter your details below to create a new account!"}
				</p>
			</header>

			<form onSubmit={Authenticate} className="mt-16 flex flex-col items-center gap-4 min-w-[400px]">
				<fieldset className="w-full flex flex-col">
					<label htmlFor="email" className="text-sm font-medium">
						Email:
					</label>
					<div className="flex flex-row gap-2 items-center  rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md px-4">
						<i className="pi pi-user"></i>
						<input className="py-3 border-none outline-none w-full" placeholder="johndoe@example.com" type="email" name="email" id="email" value={credentials.email} onChange={(e) => setCredentials((prev) => (Object.assign(Object.assign({}, prev), { email: e.target.value })))}/>
					</div>
				</fieldset>

				<fieldset className="w-full flex flex-col">
					<label htmlFor="password" className="text-sm font-medium">
						Password:
					</label>
					<div className="flex flex-row gap-2 items-center  rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md px-4">
						<i className="pi pi-key"></i>
						<input className="py-3 border-none outline-none w-full" placeholder="http://www.example.com/something?cool=true" type="password" name="password" id="password" value={credentials.password} onChange={(e) => setCredentials((prev) => (Object.assign(Object.assign({}, prev), { password: e.target.value })))}/>
					</div>
				</fieldset>

				<button type="submit" className="w-full bg-violet-600 text-white py-2 font-medium rounded-md hover:bg-violet-400 transition-all duration-300 hover:border-violet-500 border border-violet-600">
					{mode === "login" ? "Log In" : "Register"}
				</button>
				<p className="text-gray-400 text-sm">
					Don't have an account?{" "}
					{mode === "login" ? (<react_router_dom_1.Link to="/auth?mode=register" className="text-violet-600 underline hover:text-violet-400" onClick={() => setMode("signup")}>
							Signup now
						</react_router_dom_1.Link>) : (<react_router_dom_1.Link className="text-violet-600 underline hover:text-violet-400" onClick={() => setMode("login")} to="/auth?mode=login">
							Login now
						</react_router_dom_1.Link>)}
				</p>
			</form>
		</div>);
};
exports.default = Auth;
