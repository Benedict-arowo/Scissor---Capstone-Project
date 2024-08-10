"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controlllers/auth.controller"));
const Router = express_1.default.Router();
Router.post("/login", auth_controller_1.default.login);
Router.post("/register", auth_controller_1.default.register);
exports.default = {
    routeUrl: "auth",
    Router,
};
