"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_controller_1 = __importDefault(require("../controlllers/url.controller"));
const authenticated_1 = require("../middlewears/authenticated");
const _1 = require(".");
const cache_1 = __importDefault(require("../middlewears/cache"));
const Router = express_1.default.Router();
Router.route("/url/")
    .get(authenticated_1.AuthenticatedOnly, _1.limiter, cache_1.default, url_controller_1.default.getMany)
    .post(authenticated_1.Authenticate, _1.limiter, url_controller_1.default.create);
Router.route("/url/:id")
    .get(authenticated_1.AuthenticatedOnly, _1.limiter, cache_1.default, url_controller_1.default.getOne)
    .patch(authenticated_1.AuthenticatedOnly, url_controller_1.default.update)
    .delete(authenticated_1.AuthenticatedOnly, url_controller_1.default.delete);
Router.route("/url/:id/qrcode").post(authenticated_1.AuthenticatedOnly, _1.limiter, url_controller_1.default.generateQRCode);
// Router.get("/:id", urlController.visit); !! Moved to routes/index.ts file
exports.default = {
    routeUrl: "",
    Router,
};
