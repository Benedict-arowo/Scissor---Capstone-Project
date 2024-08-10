import cron from "node-cron";
import { DeleteTokens, GetDeletableTokens } from "./token.cronjob";

// Cron job to fetch deletable tokens at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
	try {
		const tokens = await GetDeletableTokens();
		// Optionally, send emails or perform other actions here
		console.log(tokens);
		console.log("Successfully fetched deletable tokens.");

		if (tokens.length === 0) return;
		// Schedule the deletion of tokens at 23:00
		cron.schedule(
			"0 23 * * *",
			async () => {
				try {
					await DeleteTokens(
						tokens.map((token) => token.user_id) as string[]
					);
					console.log("Successfully deleted tokens.");
				} catch (error) {
					console.error("Error deleting tokens:", error);
				}
			},
			{
				scheduled: false, // Ensures this cron job is not automatically scheduled
			}
		);
	} catch (error) {
		console.error("Error fetching deletable tokens:", error);
	}
});
