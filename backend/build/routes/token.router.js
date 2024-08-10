"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_controller_1 = __importDefault(require("../controlllers/token.controller"));
const authenticated_1 = require("../middlewears/authenticated");
const _1 = require(".");
const Router = express_1.default.Router();
Router.route("/")
    .get(authenticated_1.AuthenticatedOnly, _1.limiter, token_controller_1.default.get)
    .post(authenticated_1.AuthenticatedOnly, _1.limiter, token_controller_1.default.create)
    .delete(authenticated_1.AuthenticatedOnly, _1.limiter, token_controller_1.default.delete);
exports.default = {
    routeUrl: "token",
    Router,
};
