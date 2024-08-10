"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateURLSchema = exports.CreateURLSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateURLSchema = joi_1.default.object({
    short_url: joi_1.default.string().min(4).max(8).optional(),
    long_url: joi_1.default.string().uri().required(),
    expiration_date: joi_1.default.date().iso().optional(),
});
exports.UpdateURLSchema = joi_1.default.object({
    short_url: joi_1.default.string().min(4).max(8).optional(),
    long_url: joi_1.default.string().uri().optional(),
});
