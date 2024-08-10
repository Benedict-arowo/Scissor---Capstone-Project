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
const node_cron_1 = __importDefault(require("node-cron"));
const token_cronjob_1 = require("./token.cronjob");
// Cron job to fetch deletable tokens at midnight (00:00)
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield (0, token_cronjob_1.GetDeletableTokens)();
        // Optionally, send emails or perform other actions here
        console.log(tokens);
        console.log("Successfully fetched deletable tokens.");
        if (tokens.length === 0)
            return;
        // Schedule the deletion of tokens at 23:00
        node_cron_1.default.schedule("0 23 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, token_cronjob_1.DeleteTokens)(tokens.map((token) => token.user_id));
                console.log("Successfully deleted tokens.");
            }
            catch (error) {
                console.error("Error deleting tokens:", error);
            }
        }), {
            scheduled: false, // Ensures this cron job is not automatically scheduled
        });
    }
    catch (error) {
        console.error("Error fetching deletable tokens:", error);
    }
}));
