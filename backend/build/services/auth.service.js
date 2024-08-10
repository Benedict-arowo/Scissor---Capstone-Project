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
const config_1 = __importDefault(require("../config"));
const error_1 = __importStar(require("../middlewears/error"));
const db_1 = require("../prisma/db");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.login = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.User.findUniqueOrThrow({ where: { email } });
                if (!(yield this.verifyPassword(user.password, password)))
                    throw new error_1.BadrequestError("Invalid password.");
                delete user.password;
                const token = this.generateToken({ email });
                return { access_token: token, user };
            }
            catch (error) {
                console.log(error);
                if (error.code === "P2025")
                    throw new error_1.NotFoundError("User not found.");
                if (error.code)
                    throw new error_1.default(error.message, error.code);
                return new error_1.InternalServerError(error.message);
            }
        });
        this.register = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.User.create({
                    data: {
                        email,
                        password: yield argon2_1.default.hash(password),
                    },
                });
                delete user.password;
                return user;
            }
            catch (error) {
                console.log(error.code);
                if (error.code === "P2002")
                    throw new error_1.BadrequestError("Email already exists.");
                throw new error_1.InternalServerError(error.message);
            }
        });
        this.verifyPassword = (hashed_value, password) => __awaiter(this, void 0, void 0, function* () {
            return yield argon2_1.default.verify(hashed_value, password);
        });
        this.generateToken = (payload) => {
            return jsonwebtoken_1.default.sign(payload, config_1.default.JWT_SECERET, {
                expiresIn: "3h",
            });
        };
    }
}
exports.default = new AuthService();
