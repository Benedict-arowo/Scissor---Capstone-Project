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
exports.AuthenticatedOnly = exports.Authenticate = void 0;
const error_1 = require("./error");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const db_1 = require("../prisma/db");
/**
 * Middleware function to check authentication.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */
const CheckAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { headers: { api_key }, } = req;
    if (api_key) {
        const token = yield db_1.Token.findUnique({
            where: {
                token: api_key,
            },
            select: {
                user: true,
            },
        });
        if (!token)
            throw new error_1.BadrequestError("Invalid api_key provided.");
        req.user = token.user;
        return next();
    }
    const token = req.headers["authorization"];
    if (!token || !token.startsWith("Bearer "))
        throw new error_1.BadrequestError("Unathenticated");
    let parsed_token = token.split(" ")[1];
    const { email } = jsonwebtoken_1.default.verify(parsed_token, config_1.default.JWT_SECERET);
    if (!email)
        throw new error_1.BadrequestError("Invalid Token");
    const user = yield db_1.User.findUnique({
        where: {
            email,
        },
    });
    req.user = user;
    next();
});
/**
 * Middleware function to authenticate requests.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */
const Authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CheckAuthentication(req, res, next);
    }
    catch (error) {
        next();
    }
});
exports.Authenticate = Authenticate;
/**
 * Middleware function that checks if the request is authenticated.
 * If the request is authenticated, it calls the next middleware function.
 * If the request is not authenticated or the authentication token has expired,
 * it throws an error and calls the appropriate error handler middleware.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
const AuthenticatedOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CheckAuthentication(req, res, next);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError)
            next(new error_1.UnauthorizedError("Token Exipred"));
        next(new error_1.UnauthorizedError(error.message));
    }
});
exports.AuthenticatedOnly = AuthenticatedOnly;
