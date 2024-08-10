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
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.TOKENS.CLOUDINARY.CLOUD_NAME,
    api_key: config_1.default.TOKENS.CLOUDINARY.API_KEY,
    api_secret: config_1.default.TOKENS.CLOUDINARY.API_SECRET,
});
const upload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ file, opts }) {
    const { path, format } = opts;
    // If the file is a buffer, convert it to a stream
    const bufferStream = streamifier_1.default.createReadStream(file);
    const data = yield new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: "/scissor" + path,
            use_filename: false,
            unique_filename: true,
            overwrite: false,
            format,
            public_id: `${new Date().getTime()}`,
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
        bufferStream.pipe(uploadStream);
    });
    return data;
});
exports.upload = upload;
exports.default = cloudinary_1.v2;
