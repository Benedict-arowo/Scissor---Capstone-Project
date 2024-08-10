"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const url_service_1 = __importDefault(require("../services/url.service"));
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const wrapper_1 = __importDefault(require("../middlewears/wrapper"));
const redis_client_1 = __importStar(require("../middlewears/redis_client"));
const validators_1 = __importDefault(require("../middlewears/validators"));
const url_validator_1 = require("../middlewears/validators/url.validator");
class UrlController {
    constructor() {
        this.create = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, validators_1.default)(url_validator_1.CreateURLSchema, req.body);
            const data = yield url_service_1.default.create(Object.assign(Object.assign({}, req.body), { user_id: req.user ? req.user.email : undefined }));
            return res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "Sucessfully created URL.", data });
        }));
        this.getMany = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user: { email }, params: { page, limit }, } = req;
            const data = yield url_service_1.default.getMany(email, { page, limit });
            redis_client_1.default.set((0, redis_client_1.getRedisKey)(req), JSON.stringify({ message: "Success", data }), {
                EX: 60 * 5, // 5 minutes
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Success", data });
        }));
        this.getOne = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user: { email }, params: { id: url_id }, } = req;
            const data = yield url_service_1.default.getOne(email, url_id);
            redis_client_1.default.set((0, redis_client_1.getRedisKey)(req), JSON.stringify({ message: "Success", data }), {
                EX: 60 * 5, // 5 minutes
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Success", data });
        }));
        this.visit = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const parsed_user_agent = (0, ua_parser_js_1.default)(req.headers["user-agent"]);
            const data = yield url_service_1.default.visit(id, Object.assign(Object.assign({}, parsed_user_agent), { ip: req.ip }));
            return res.render("redirect", { url: data.url, is_safe: data.is_safe });
        }));
        this.update = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, validators_1.default)(url_validator_1.UpdateURLSchema, req.body);
            const { params: { id }, user: { email }, body, } = req;
            const data = yield url_service_1.default.update(id, email, body);
            // Removes the cached data if it exists about the user, and the updated data
            const cacheKey = (0, redis_client_1.getRedisKey)(req);
            if (yield redis_client_1.default.get(cacheKey)) {
                redis_client_1.default.del((0, redis_client_1.getRedisKey)(req));
                (0, redis_client_1.deleteKeysByPattern)(`/url|+|${email}*`);
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Successfully updated URL.", data: data });
        }));
        this.generateQRCode = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { params: { id }, user: { email }, } = req;
            const data = yield url_service_1.default.QRCode(id, email);
            return res.json({ message: "QRCode generated successfully", data });
        }));
        this.delete = (0, wrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { params: { id }, user: { email }, } = req;
            yield url_service_1.default.delete(id, email);
            // Removes the cached data if it exists about the user, and the updated data
            const cacheKey = (0, redis_client_1.getRedisKey)(req);
            if (yield redis_client_1.default.get(cacheKey)) {
                redis_client_1.default.del((0, redis_client_1.getRedisKey)(req));
                (0, redis_client_1.deleteKeysByPattern)(`/url|+|${email}*`);
            }
            return res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({ message: "success" });
        }));
    }
}
exports.default = new UrlController();
