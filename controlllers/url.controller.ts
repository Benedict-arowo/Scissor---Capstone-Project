import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import urlService from "../services/url.service";
import UAParser from "ua-parser-js";
import Wrapper from "../middlewears/wrapper";

class UrlController {
	public create = Wrapper(async (req: Request, res: Response) => {
		const data = await urlService.create(req.body);
		return res
			.status(StatusCodes.CREATED)
			.json({ message: "Url Created.", data });
	});

	public getMany = async (req: Request, res: Response) => {
		return res
			.status(StatusCodes.OK)
			.json({ message: "success", data: "" });
	};

	public getOne = async (req: Request, res: Response) => {
		return res
			.status(StatusCodes.OK)
			.json({ message: "success", data: "" });
	};

	public visit = Wrapper(async (req: Request, res: Response) => {
		const { id } = req.params;
		const parsed_user_agent = UAParser(req.headers["user-agent"]);

		const url = await urlService.visit(id, {
			...parsed_user_agent,
			ip: req.ip,
		});

		return res.redirect(url as string);
	});

	public update = async (req: Request, res: Response) => {
		return res
			.status(StatusCodes.OK)
			.json({ message: "success", data: "" });
	};

	public delete = async (req: Request, res: Response) => {
		return res
			.status(StatusCodes.OK)
			.json({ message: "success", data: "" });
	};
}

export default new UrlController();
