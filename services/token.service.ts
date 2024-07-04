import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Token } from "../prisma/db";
import { BadrequestError } from "../middlewears/error";
// const crypto = require('crypto');
import crypto from "crypto";
import config from "../config";

class TokenController {
	public create = async (user_id: string, origin: string[]) => {
		const token = await Token.findMany({
			where: {
				user_id,
			},
		});

		// TODO: Review later, and make adjustments if needed (If user contains token, then use that to check instead of querying the db.)
		if (token)
			throw new BadrequestError("User already has an access token.");

		const new_token = await Token.create({
			data: {
				user_id,
				token: crypto
					.randomBytes(config.OPTIONS.TOKEN_LENGTH || 16)
					.toString("hex"),
				expiration_date: this.calculateExpirationDate(
					config.OPTIONS.TOKEN_EXPIRY_DAYS || 7
				),
				is_revoked: false,
				origin: origin ? origin : undefined,
			},
			select: {
				token: true,
				expiration_date: true,
				origin: true,
			},
		});

		return new_token;
	};

	public update = async (user_id: string, origin: string[]) => {
		const token = await Token.findUniqueOrThrow({
			where: {
				user_id: user_id,
			},
		});

		if (token.is_revoked)
			throw new BadrequestError("Token has been revoked.");

		const updated_token = await Token.update({
			where: {
				user_id,
			},
			data: {
				origin,
			},
			select: {
				expiration_date: true,
				origin: true,
			},
		});

		return updated_token;
	};

	public delete = async (user_id: string) => {
		await Token.deleteMany({
			where: {
				user_id,
			},
		});

		return 0;
	};

	private calculateExpirationDate = (days: number) => {
		return new Date(Date.now() + 60 * 60 * 1000 * 24 * days);
	};
}

export default new TokenController();
