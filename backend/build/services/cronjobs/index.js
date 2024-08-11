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
exports.sendEmailNotifications = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.default.GMAIL.USER,
        pass: config_1.default.GMAIL.PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to the email server:", error);
    }
    else {
        console.log("Email server is ready to send messages:", success);
    }
});
// Function to send email notifications
const sendEmailNotifications = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = items.map((item) => {
        const mailOptions = {
            from: config_1.default.GMAIL.USER,
            to: item.email,
            subject: item.subject,
            text: item.message,
        };
        return transporter.sendMail(mailOptions);
    });
    try {
        const results = yield Promise.all(promises);
        results.forEach((info, index) => {
            console.log(`Email sent to ${items[index].email}:`, info.response);
        });
    }
    catch (error) {
        console.error("Error sending one or more emails:", error);
    }
});
exports.sendEmailNotifications = sendEmailNotifications;
