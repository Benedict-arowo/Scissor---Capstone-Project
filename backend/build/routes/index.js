"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const url_controller_1 = __importDefault(require("../controlllers/url.controller"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cache_1 = __importDefault(require("../middlewears/cache"));
const routelist = [];
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
const Routes = (app) => {
    var _a;
    const filelist = fs_1.default.readdirSync(path_1.default.join(__dirname));
    // Importing all router files.
    for (const file of filelist) {
        if (file.includes(".router."))
            routelist.push(require(path_1.default.join(__dirname, file)));
    }
    let prefix = "";
    // Looks for a route prefix eg: (/api/v1)
    if (config_1.default.ROUTE_PREFIX) {
        if ((_a = config_1.default.ROUTE_PREFIX) === null || _a === void 0 ? void 0 : _a.startsWith("/"))
            prefix = config_1.default.ROUTE_PREFIX;
        else
            prefix = "/" + config_1.default.ROUTE_PREFIX;
    }
    // Routes registration
    routelist.forEach((route) => {
        const { routeUrl, Router } = route.default;
        // Constructs the url for the route
        const url = prefix ? prefix + "/" + routeUrl : routeUrl;
        app.use(url, Router);
    });
    app.get("/:id", cache_1.default, url_controller_1.default.visit);
    console.log(`Successfully imported ${routelist.length} router(s)`);
};
exports.default = Routes;
