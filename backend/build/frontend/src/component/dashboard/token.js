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
const utils_1 = __importDefault(require("../../utils"));
const toast_1 = require("primereact/toast");
const Token = () => {
    const [visible, setVisibile] = (0, react_1.useState)(true);
    const [tokenVisible, setTokenVisible] = (0, react_1.useState)(false);
    const [err, setErr] = (0, react_1.useState)("");
    const [token, setToken] = (0, react_1.useState)(null);
    const toast = (0, react_1.useRef)(null);
    const FetchToken = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`${utils_1.default.API_URL}/token`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (response.status === 404)
            return;
        if (!response.ok) {
            const data = yield response.json();
            setErr(data.message);
            throw new Error(data ? data.message : "Error fetching your token!");
        }
        const data = yield response.json();
        setToken(data.data);
    });
    const CreateToken = (button) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        (_a = toast.current) === null || _a === void 0 ? void 0 : _a.show({
            severity: "info",
            summary: "Creating token...",
        });
        const response = yield fetch(`${utils_1.default.API_URL}/token`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (!response.ok) {
            const data = yield response.json();
            (_b = toast.current) === null || _b === void 0 ? void 0 : _b.show({
                severity: "error",
                summary: "Error...",
                detail: data ? data.message : "Error creating your token!",
            });
            setErr(data.message);
            button.disabled = true;
            throw new Error(data ? data.message : "Error creating your token!");
        }
        (_c = toast.current) === null || _c === void 0 ? void 0 : _c.show({
            severity: "success",
            summary: "Success!",
            detail: "Successfully created token!",
        });
        const data = yield response.json();
        setToken(data.data);
    });
    const DeleteToken = (button) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        (_a = toast.current) === null || _a === void 0 ? void 0 : _a.show({
            severity: "info",
            summary: "Deleting token...",
        });
        const response = yield fetch(`${utils_1.default.API_URL}/token`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (!response.ok) {
            const data = yield response.json();
            (_b = toast.current) === null || _b === void 0 ? void 0 : _b.show({
                severity: "error",
                summary: "Error...",
                detail: data
                    ? data.message
                    : "Error trying to delete your token!",
            });
            setErr(data.message);
            button.disabled = true;
            throw new Error(data ? data.message : "Error trying to delete your token!");
        }
        (_c = toast.current) === null || _c === void 0 ? void 0 : _c.show({
            severity: "success",
            summary: "Success!",
            detail: "Successfully deleted token!",
        });
        setToken(null);
    });
    (0, react_1.useEffect)(() => {
        FetchToken();
    }, []);
    return (<div className="m-8">
			<toast_1.Toast ref={toast}/>
			<header className="flex flex-col gap-1 mb-12">
				<h3 className="font-semibold text-2xl">
					User Token{" "}
					<i onClick={() => setVisibile((prev) => !prev)} className="pi pi-question-circle cursor-pointer text-gray-400 text-lg ml-2"></i>
				</h3>
				{visible && (<p>
						Lorem ipsum dolor sit amet consectetur, adipisicing
						elit. Repellat quam eaque libero ad officiis modi saepe
						unde laboriosam odio perspiciatis sapiente at earum
						neque, similique sint magnam, minus ea temporibus.
					</p>)}
			</header>

			{err && err}

			{!token && (<button onClick={(e) => CreateToken(e.currentTarget)} className="px-4 w-fit bg-violet-600 py-2 text-white rounded-lg">
					Create Token
				</button>)}
			{token && (<div className="max-w-[800px]">
					<div className="border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md rounded-md flex flex-row items-center px-2 overflow-hidden">
						<input className="py-2 pl-2 outline-none w-full" type={tokenVisible === true ? "text" : "password"} name="alias" id="alias" minLength={5} maxLength={8} value={tokenVisible
                ? token.token
                : "why are you peaking :eyes:"} disabled/>
						<span className="cursor-pointer" onClick={() => setTokenVisible((prev) => !prev)}>
							{tokenVisible && (<i className="pi pi-eye-slash"></i>)}
							{!tokenVisible && <i className="pi pi-eye"></i>}
						</span>
					</div>
					<button onClick={(e) => DeleteToken(e.currentTarget)} className="px-4 w-fit bg-red-500 py-2 text-white rounded-lg mt-5">
						Delete Token
					</button>
				</div>)}
		</div>);
};
exports.default = Token;
