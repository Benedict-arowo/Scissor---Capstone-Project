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
const db_1 = require("../prisma/db");
const error_1 = require("../middlewears/error");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config"));
class TokenController {
    constructor() {
        this.create = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const token = yield db_1.Token.findUnique({
                where: {
                    user_id,
                },
            });
            if (token)
                throw new error_1.BadrequestError("User already has an access token.");
            const new_token = yield db_1.Token.create({
                data: {
                    user_id,
                    token: crypto_1.default
                        .randomBytes(config_1.default.OPTIONS.TOKEN_LENGTH || 16)
                        .toString("hex"),
                    expiration_date: this.calculateExpirationDate(config_1.default.OPTIONS.TOKEN_EXPIRY_DAYS || 7),
                    is_revoked: false,
                },
                select: {
                    token: true,
                    expiration_date: true,
                },
            });
            return new_token;
        });
        this.get = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const token = yield db_1.Token.findUnique({
                where: {
                    user_id,
                },
            });
            if (!token) {
                throw new error_1.NotFoundError("User has no token.");
            }
            return token;
        });
        this.delete = (user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.Token.delete({
                    where: {
                        user_id,
                    },
                });
                return 0;
            }
            catch (error) {
                if (error.code === "P2025")
                    throw new error_1.NotFoundError("Token does not exist.");
                return new error_1.InternalServerError(error.message);
            }
        });
        this.calculateExpirationDate = (days) => {
            return new Date(Date.now() + 60 * 60 * 1000 * 24 * days);
        };
    }
}
exports.default = new TokenController();
