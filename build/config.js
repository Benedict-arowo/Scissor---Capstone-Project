"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: "./.env" });
const config = {
    ROUTE_PREFIX: "api",
    NODE_ENV: "development",
    PORT: parseInt(process.env.PORT) || 5000,
    DB: {
        HOST: process.env.HOST,
        PORT: parseInt(process.env.PORT),
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DATABASE: process.env.DATABASE,
    },
    CORS_OPTION: {
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split("|")
            : ["http://localhost:3000/"],
    },
};
exports.default = config;
