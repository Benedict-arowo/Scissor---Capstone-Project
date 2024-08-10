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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const error_1 = __importStar(require("./error"));
const http_status_codes_1 = require("http-status-codes");
const ErrorHandler = (err, req, res, next) => {
    if (err instanceof error_1.ValidationError)
        return res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ errors: err.errors });
    if (err instanceof error_1.default)
        return res.status(err.code).json({
            message: err.message,
            stack: config_1.default.NODE_ENV === "development" ? err.stack : null,
        });
    else
        return res.status(500).json({
            message: err.message,
            stack: config_1.default.NODE_ENV === "development" ? err.stack : null,
        });
};
exports.default = ErrorHandler;
