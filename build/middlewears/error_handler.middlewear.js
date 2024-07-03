"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const error_1 = __importDefault(require("./error"));
const ErrorHandler = (err, req, res, next) => {
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
