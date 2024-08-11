"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../prisma/db");
const error_1 = require("../middlewears/error");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const cloudinary_uploader_1 = require("../middlewears/cloudinary_uploader");
const bull_1 = __importDefault(require("bull"));
const myQueue = new bull_1.default("main", {
    redis: {
        host: config_1.default.REDIS.HOST,
        port: config_1.default.REDIS.PORT,
        password: config_1.default.REDIS.PASSWORD,
    },
});
class UrlService {
    constructor() {
        /**
         * Creates a new URL entry in the database.
         * @param data - The data for creating the URL.
         * @returns The created URL entry.
         * @throws BadrequestError if the URL is invalid, the short URL is already taken, or the expiration date is not within 6 months.
         */
        this.create = (data) => __awaiter(this, void 0, void 0, function* () {
            // if (!this.isValidURL(data.long_url))
            // 	throw new BadrequestError("Invalid URL provided.");
            let valid_short_url = false;
            do {
                if (!data.short_url) {
                    // Generates a random string with the length between 5-8 inclusively.
                    data.short_url = this.generateRandomString(Math.floor(Math.random() * (8 - 5 + 1)) + 5);
                }
                else {
                    if (!(data.short_url.length >= 4 &&
                        data.short_url.length <= 8)) {
                        throw new error_1.BadrequestError("Short URL must be between 4-8 characters.");
                    }
                }
                // Check if the URL is already taken.
                const existing_url = yield db_1.URL.findFirst({
                    where: { short_url: data.short_url },
                });
                if (existing_url && data.short_url)
                    throw new error_1.BadrequestError("Short URL is already taken.");
                if (!existing_url) {
                    valid_short_url = true;
                    break;
                }
            } while (valid_short_url === false);
            if (!data.expiration_date) {
                const threeMonthsFromNow = new Date();
                threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                data.expiration_date = threeMonthsFromNow;
            }
            if (!this.isWithinSixMonths(new Date(data.expiration_date)))
                throw new error_1.BadrequestError("Expiration date must be within 6 months.");
            const url = yield db_1.URL.create({
                data: {
                    short_url: data.short_url,
                    long_url: data.long_url,
                    expiration_date: new Date(data.expiration_date),
                    owner_id: data.user_id && data.user_id,
                },
            });
            // Scans the URL to find out if it's safe or not, handled by workers.
            if (config_1.default.OPTIONS.SCAN_URLS) {
                if (config_1.default.USE_WORKER) {
                    myQueue.add({
                        type: "SCAN_URL",
                        data: { long_url: data.long_url, id: url.id },
                    });
                }
                else {
                    yield this.updateUrlInfo(data.long_url, url.id);
                }
            }
            return url;
        });
        this.getMany = (user_id, opts) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = opts;
            const data = yield db_1.URL.findMany({
                where: {
                    owner_id: user_id,
                },
                select: {
                    id: true,
                    short_url: true,
                    long_url: true,
                    created_at: true,
                    expiration_date: true,
                    is_safe: true,
                    clicks: {
                        orderBy: {
                            created_at: "desc",
                        },
                        select: {
                            id: true,
                            ip: true,
                            is_unique: true,
                            browser: true,
                            OS: true,
                            created_at: true,
                            city: true,
                            country: true,
                            region: true,
                            timezone: true,
                            lat: true,
                            lon: true,
                            ip_type: true,
                        },
                    },
                    qr_code: true,
                    last_visited: true,
                    _count: true,
                },
                orderBy: {
                    created_at: "desc",
                },
                take: limit,
                skip: (page - 1) * limit,
            });
            return data;
        });
        this.visit = (id, user_info) => __awaiter(this, void 0, void 0, function* () {
            const { ip, browser, os } = user_info;
            try {
                const url = yield db_1.URL.update({
                    where: {
                        short_url: id,
                    },
                    data: {
                        last_visited: new Date(),
                    },
                });
                const url_click = yield db_1.URLClick.create({
                    data: {
                        url_id: url.id,
                        ip,
                        is_unique: yield this.isUnique(ip, url.id),
                        browser: browser && browser.name !== undefined
                            ? browser.name + " | " + browser.version
                            : undefined,
                        OS: os && os.name !== undefined
                            ? os.name.toString() + " | " + os.version
                            : undefined,
                    },
                });
                // Update user IP info using background worker
                if (config_1.default.OPTIONS.UPDATE_USER_IP_INFO) {
                    if (config_1.default.USE_WORKER) {
                        myQueue.add({
                            type: "IP_INFO",
                            data: { ip, id: url_click.id },
                        });
                    }
                    else {
                        yield this.updateUserIpInfo(ip, url_click.id);
                    }
                }
                return {
                    email: url.owner_id,
                    url: url.long_url,
                    is_safe: url.is_safe,
                };
            }
            catch (error) {
                // console.log(error);
                if (error.code === "P2025") {
                    throw new error_1.NotFoundError("URL does not exists");
                }
                throw new error_1.InternalServerError(error.message);
            }
        });
        this.getOne = (user_id, url_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield db_1.URL.findUniqueOrThrow({
                    where: { id: url_id, owner_id: user_id },
                });
                return url;
            }
            catch (error) {
                if (error.code === "P2025")
                    throw new error_1.NotFoundError("URL does not exists");
                throw new error_1.InternalServerError(error.message);
            }
        });
        this.update = (url_id, user_id, data) => __awaiter(this, void 0, void 0, function* () {
            if (data.long_url && !this.isValidURL(data.long_url))
                throw new error_1.BadrequestError("Invalid URL provided.");
            if (data.short_url &&
                !(data.short_url.length >= 5 &&
                    data.short_url.length <= 8)) {
                throw new error_1.BadrequestError("Short URL must be between 5-8 characters.");
            }
            const url = yield db_1.URL.update({
                where: {
                    id: url_id,
                    owner_id: user_id,
                },
                data: {
                    long_url: data.long_url && data.long_url,
                    short_url: data.short_url && data.short_url,
                },
            });
            return url;
        });
        this.delete = (id, user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.URL.delete({
                    where: {
                        id,
                        owner_id: user_id,
                    },
                });
                return 0;
            }
            catch (error) {
                if (error.code === "P2025")
                    throw new error_1.NotFoundError("URL does not exists");
                throw new error_1.InternalServerError(error.message);
            }
        });
        this.QRCode = (id, user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield db_1.URL.findUniqueOrThrow({
                    where: {
                        id,
                    },
                });
                if (url.owner_id && url.owner_id !== user_id)
                    throw new error_1.BadrequestError("You do not have permission to perform this action");
                const QR_CODE = yield this.generateQRCode(config_1.default.BASE_URL + url.short_url);
                if (QR_CODE === undefined)
                    throw new error_1.InternalServerError("Error generating QR code.");
                yield db_1.URL.update({
                    where: {
                        id,
                    },
                    data: {
                        qr_code: QR_CODE !== undefined
                            ? {
                                url: QR_CODE.secure_url,
                                id: QR_CODE.public_id,
                            }
                            : undefined,
                    },
                });
                return {
                    url: QR_CODE.secure_url,
                    id: QR_CODE.public_id,
                };
            }
            catch (error) {
                if (error.code === "P2025")
                    throw new error_1.NotFoundError("URL does not exists");
                throw new error_1.InternalServerError(error.message);
            }
        });
        this.generateRandomString = (length) => {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
        this.updateUrlInfo = (long_url, url_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { data }, } = yield axios_1.default.post("https://www.virustotal.com/api/v3/urls", { url: long_url }, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "x-apikey": config_1.default.TOKENS.VIRUSTOTAL_API_KEY,
                    },
                });
                const { data: { data: analyses_data }, } = yield axios_1.default.get(`https://www.virustotal.com/api/v3/analyses/${data.id}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-apikey": config_1.default.TOKENS.VIRUSTOTAL_API_KEY,
                    },
                });
                const { malicious, suspicious } = analyses_data.attributes.stats;
                yield db_1.URL.update({
                    where: { id: url_id },
                    data: {
                        is_safe: malicious === 0 && suspicious === 0 ? true : false,
                    },
                });
                return 0;
            }
            catch (error) {
                console.log("Error updating URLINFO", error.message);
                console.log(error);
            }
        });
        /**
         * Checks if a given IP and URL combination is unique within the last 7 days.
         * @param ip - The IP address to check.
         * @param url_id - The URL ID to check.
         * @returns A boolean indicating whether the IP and URL combination is unique.
         */
        this.isUnique = (ip, url_id) => __awaiter(this, void 0, void 0, function* () {
            const url_click = yield db_1.URLClick.findFirst({
                where: {
                    ip,
                    // url_id,
                    created_at: {
                        gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
                    }, // 7 days
                },
            });
            return url_click ? false : true;
        });
        this.generateQRCode = (url) => __awaiter(this, void 0, void 0, function* () {
            const qr = yield axios_1.default.get("http://api.qrserver.com/v1/create-qr-code", {
                responseType: "text",
                params: {
                    data: url,
                    size: "150x150",
                    format: "svg",
                    qzone: 2,
                    color: "50-15-0",
                },
            });
            const uploaded = yield (0, cloudinary_uploader_1.upload)({
                file: Buffer.from(qr.data),
                opts: {
                    path: "",
                    format: "svg",
                },
            });
            return uploaded;
        });
        this.updateUserIpInfo = (ip, url_click_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield axios_1.default.get(`http://api.weatherapi.com/v1/ip.json`, {
                    params: {
                        key: config_1.default.TOKENS.WEATHER_API,
                        q: ip,
                    },
                });
                const { city, country_name: country, lat, lon, region, tz_id: timezone, type: ip_type, } = request.data;
                yield db_1.URLClick.update({
                    where: {
                        id: url_click_id,
                    },
                    data: {
                        ip_type,
                        city,
                        country,
                        region,
                        timezone,
                        lat,
                        lon,
                    },
                });
                console.log("Successfully updated user's location!");
            }
            catch (error) {
                if (error.code == 400) {
                    console.log("Invalid IP provided.");
                }
                else if (error.code == "P2025") {
                    console.log("Record not found.");
                }
                else {
                    console.log("Fetch Error - UpdateUserIPInfo", error.message);
                    console.log(error);
                }
            }
        });
    }
    isValidURL(str) {
        var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
        return pattern.test(str);
    }
    isWithinSixMonths(date) {
        const currentDate = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        return date <= sixMonthsFromNow && date >= currentDate;
    }
}
exports.default = new UrlService();
