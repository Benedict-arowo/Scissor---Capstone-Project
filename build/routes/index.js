"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const routelist = [];
const Routes = (app) => {
    const filelist = fs_1.default.readdirSync(path_1.default.join(__dirname));
    // Importing all router files.
    for (const file of filelist) {
        if (file.includes(".router."))
            routelist.push(require(path_1.default.join(__dirname, file)));
    }
    // Routes registration
    routelist.forEach((route) => {
        var _a;
        const { routeUrl, Router } = route.default;
        let prefix = "";
        // Looks for a route prefix eg: (/api/v1)
        if (config_1.default.ROUTE_PREFIX) {
            if ((_a = config_1.default.ROUTE_PREFIX) === null || _a === void 0 ? void 0 : _a.startsWith("/"))
                prefix = config_1.default.ROUTE_PREFIX;
            else
                prefix = "/" + config_1.default.ROUTE_PREFIX;
        }
        // Constructs the url for the route
        const url = prefix ? prefix + "/" + routeUrl : routeUrl;
        app.use(url, Router);
    });
    console.log(`Successfully imported ${routelist.length} router(s)`);
};
exports.default = Routes;
