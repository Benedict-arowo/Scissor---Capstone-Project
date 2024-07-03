import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class TokenController {
	public create = async (req: Request, res: Response) => {
		return res
			.status(StatusCodes.CREATED)
			.json({ message: "Token Created.", data: "" });
	};

	public update = async (req: Request, res: Response) => {
		return res
			.status(StatusCodes.OK)
			.json({ message: "Token Updated.", data: "" });
	};

	public delete = async (req: Request, res: Response) => {
		return res
			.status(StatusCodes.NO_CONTENT)
			.json({ message: "Token Deleted." });
	};
}

export default new TokenController();
