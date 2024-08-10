import { Token } from "../../prisma/db";

/**
 * Deletes tokens based on the provided array of IDs.
 * @param ids - An array of string IDs representing the tokens to be deleted.
 */
export const DeleteTokens = async (ids: string[]) => {
	const delete_list = <string[]>[];

	const tokens = await Token.findMany({
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

	await Token.deleteMany({
		where: {
			OR: delete_list.map((id) => ({
				user_id: id,
			})),
		},
	});
};

/**
 * Retrieves the list of deletable tokens.
 * Tokens are considered deletable if their expiration date is greater than or equal to tomorrow's date
 * and less than the day after tomorrow's date.
 *
 * @returns {Promise<Token[]>} The list of deletable tokens.
 */

export const GetDeletableTokens = async () => {
	const today = new Date();
	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
	today.setHours(0, 0, 0, 0); // Set hours to 00:00:00:000 for precise date comparison

	const tokens = await Token.findMany({
		where: {
			expiration_date: {
				gte: tomorrow, // Greater than or equal to tomorrow's date
				lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), // Less than the day after tomorrow date.
			},
		},
	});

	return tokens;
};

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
