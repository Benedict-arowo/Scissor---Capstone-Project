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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDeletableTokens = exports.DeleteTokens = void 0;
const db_1 = require("../../prisma/db");
/**
 * Deletes tokens based on the provided array of IDs.
 * @param ids - An array of string IDs representing the tokens to be deleted.
 */
const DeleteTokens = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const delete_list = [];
    const tokens = yield db_1.Token.findMany({
        where: {
            OR: ids.map((id) => ({
                user_id: id,
            })),
        },
    });
    tokens.forEach((token) => {
        if (token.user_id && token.expiration_date <= new Date()) {
            delete_list.push(token.user_id);
        }
    });
    yield db_1.Token.deleteMany({
        where: {
            OR: delete_list.map((id) => ({
                user_id: id,
            })),
        },
    });
});
exports.DeleteTokens = DeleteTokens;
/**
 * Retrieves the list of deletable tokens.
 * Tokens are considered deletable if their expiration date is greater than or equal to tomorrow's date
 * and less than the day after tomorrow's date.
 *
 * @returns {Promise<Token[]>} The list of deletable tokens.
 */
const GetDeletableTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    today.setHours(0, 0, 0, 0); // Set hours to 00:00:00:000 for precise date comparison
    const tokens = yield db_1.Token.findMany({
        where: {
            expiration_date: {
                gte: tomorrow, // Greater than or equal to tomorrow's date
                lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), // Less than the day after tomorrow date.
            },
        },
    });
    return tokens;
});
exports.GetDeletableTokens = GetDeletableTokens;
// Function to send email notifications
// const sendEmailNotifications = async () => {
// 	const oneHourFromNow = new Date(Date.now() + 3600000);
// 	const expiringTokens = await Token.find({
// 		expiration: { $lte: oneHourFromNow },
// 	});
// 	// expiringTokens.forEach((token) => {
// 	// 	const mailOptions = {
// 	// 		from: "your-email@gmail.com",
// 	// 		to: token.userEmail,
// 	// 		subject: "Token Expiration Notice",
// 	// 		text: `Your token is about to expire at ${token.expiration}. Please renew it.`,
// 	// 	};
// 	// 	transporter.sendMail(mailOptions, (error, info) => {
// 	// 		if (error) {
// 	// 			console.log("Error sending email:", error);
// 	// 		} else {
// 	// 			console.log("Email sent:", info.response);
// 	// 		}
// 	// 	});
// 	// });
// };
