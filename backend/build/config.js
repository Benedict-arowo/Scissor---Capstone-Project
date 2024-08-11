"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: "./.env" });
const config = {
    ROUTE_PREFIX: "api",
    BASE_URL: "http://arowobenedict.tech/",
    NODE_ENV: "production",
    PORT: parseInt(process.env.PORT) || 5000,
    JWT_SECERET: process.env.JWT_SECERET,
    USE_WORKER: process.env.USE_WORKER === "true" ? true : false,
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: parseInt(process.env.REDIS_PORT),
        PASSWORD: process.env.REDIS_PASSWORD,
    },
    OPTIONS: {
        SCAN_URLS: true,
        UPDATE_USER_IP_INFO: true,
        TOKEN_EXPIRY_DAYS: 7,
        TOKEN_LENGTH: 32,
    },
    DB: {
        HOST: process.env.HOST,
        PORT: parseInt(process.env.PORT),
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DATABASE: process.env.DATABASE,
    },
    TOKENS: {
        WEATHER_API: process.env.WEATHER_API_TOKEN,
        CLOUDINARY: {
            CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            API_KEY: process.env.CLOUDINARY_API_KEY,
            API_SECRET: process.env.CLOUDINARY_API_SECRET,
        },
        VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY,
    },
    GMAIL: {
        USER: process.env.GMAIL_USER,
        PASS: process.env.GMAIL_PASS,
    },
};
exports.default = config;
