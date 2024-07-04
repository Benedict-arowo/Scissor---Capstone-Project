// import { Token } from "../../prisma/db";

// const DeleteTokens = async () => {
// 	const tokens = await Token.deleteMany({});
// };

// // Function to send email notifications
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

// export default DeleteTokens;
