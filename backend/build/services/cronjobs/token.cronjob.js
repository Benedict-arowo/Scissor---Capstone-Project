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
exports.GetDeletableTokens = exports.DeleteTokens = void 0;
const _1 = require(".");
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../../prisma/db");
/**
 * Deletes tokens based on the provided array of IDs.
 */
const DeleteTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield db_1.Token.findMany({
        where: {
            expiration_date: {
                gte: new Date(new Date().setHours(0, 0, 0)),
                lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        },
    });
    console.log("Attempting to delete", tokens.length, "tokens.");
    if (tokens.length > 0) {
        yield db_1.Token.deleteMany({
            where: {
                expiration_date: {
                    gte: new Date(new Date().setHours(0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
        });
        console.log("Deletion successful.");
    }
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
const deleteTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield (0, exports.GetDeletableTokens)();
        // Optionally, send emails or perform other actions here
        console.log(tokens);
        console.log("Successfully fetched deletable tokens.");
        if (tokens.length === 0)
            return;
        (0, _1.sendEmailNotifications)(tokens
            .filter((token) => token.user_id) // Only tokens with a valid user_id
            .map((token) => ({
            email: token.user_id,
            message: `Dear User, \nYour token with the ID ${token.token} is about to be deleted. \n\nRegards,\nThe Admin Team`,
            subject: "Token Deletion Notice",
        })));
        // Schedule the deletion of tokens at 23:00
        const deletionCron = node_cron_1.default.schedule("0 23 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, exports.DeleteTokens)();
                console.log("Successfully deleted tokens.");
            }
            catch (error) {
                console.error("Error deleting tokens:", error);
            }
        }), {
            scheduled: false, // Ensures this cron job is not automatically scheduled
        });
        deletionCron.start();
    }
    catch (error) {
        console.error("Error fetching deletable tokens:", error);
    }
});
