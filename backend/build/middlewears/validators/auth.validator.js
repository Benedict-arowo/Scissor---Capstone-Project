"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AuthSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    password: joi_1.default.string().min(3).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 3 characters long",
    }),
});
