import { NextFunction, Request, Response } from "express";
import {
	BadrequestError,
	InternalServerError,
	UnauthorizedError,
} from "./error";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import { User } from "../prisma/db";

const Authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers["authorization"];
		if (!token || !token.startsWith("Bearer "))
			return next(new BadrequestError("Unathenticated"));
		let parsed_token = token.split(" ")[1];
		const { email } = jwt.verify(parsed_token, config.JWT_SECERET) as any;
		if (!email) return next(new BadrequestError("Invalid Token"));

		const user = await User.findUnique({
			where: {
				email,
			},
		});

		(req as any).user = user;

		next();
	} catch (error: any) {
		if (error instanceof TokenExpiredError)
			next(new UnauthorizedError("Token Exipred"));
		next(new InternalServerError(error.message));
	}
};
export default Authenticate;
