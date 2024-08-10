"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.User = exports.URLClick = exports.URL = void 0;
const prisma_client_1 = __importDefault(require("./prisma_client"));
exports.URL = prisma_client_1.default.url;
exports.URLClick = prisma_client_1.default.urlClick;
exports.User = prisma_client_1.default.user;
exports.Token = prisma_client_1.default.token;
