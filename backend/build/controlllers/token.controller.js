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
const http_status_codes_1 = require("http-status-codes");
const token_service_1 = __importDefault(require("../services/token.service"));
const wrapper_1 = __importDefault(require("../middlewears/wrapper"));
class TokenController {
    constructor() {
        this.create = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user: { email }, } = req;
            const token = yield token_service_1.default.create(email);
            return res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "Token Created.", data: token });
        }));
        this.get = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user: { email }, } = req;
            const data = yield token_service_1.default.get(email);
            return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Success", data });
        }));
        this.delete = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user: { email }, } = req;
            yield token_service_1.default.delete(email);
            return res
                .status(http_status_codes_1.StatusCodes.NO_CONTENT)
                .json({ message: "Token Deleted." });
        }));
    }
}
exports.default = new TokenController();
