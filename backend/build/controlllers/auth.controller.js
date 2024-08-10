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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const wrapper_1 = __importDefault(require("../middlewears/wrapper"));
const validators_1 = __importDefault(require("../middlewears/validators"));
const auth_validator_1 = require("../middlewears/validators/auth.validator");
const http_status_codes_1 = require("http-status-codes");
class AuthController {
    constructor() {
        this.login = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, validators_1.default)(auth_validator_1.AuthSchema, req.body);
            const { body: { email, password }, } = req;
            const user = yield auth_service_1.default.login(email, password);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Login successful",
                data: user,
            });
        }));
        this.register = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, validators_1.default)(auth_validator_1.AuthSchema, req.body);
            const { body: { email, password }, } = req;
            const user = yield auth_service_1.default.register(email, password);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "Registration successful",
                data: user,
            });
        }));
    }
}
exports.default = new AuthController();
