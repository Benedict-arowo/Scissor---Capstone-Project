import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import urlService from "../services/url.service";
import UAParser from "ua-parser-js";
import Wrapper from "../middlewears/wrapper";

class UrlController {
	public create = Wrapper(async (req: Request, res: Response) => {
		const data = await urlService.create({
			...req.body,
			user_id: (req as any).user ? (req as any).user.email : undefined,
		});
		return res
			.status(StatusCodes.CREATED)
			.json({ message: "Url Created.", data });
	});

	public getMany = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
		} = req as any;
		const data = await urlService.getMany(email, { page: 1, limit: 10 });
		return res.status(StatusCodes.OK).json({ message: "success", data });
	});

	public getOne = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
			params: { id: url_id },
		} = req as any;
		const data = await urlService.getOne(email, url_id);

		return res.status(StatusCodes.OK).json({ message: "success", data });
	});

	public visit = Wrapper(async (req: Request, res: Response) => {
		const { id } = req.params;
		const parsed_user_agent = UAParser(req.headers["user-agent"]);

		const data = await urlService.visit(id, {
			...parsed_user_agent,
			ip: req.ip,
		});

		return res.render("redirect", { url: data.url, is_safe: data.is_safe });
	});

	public update = async (req: Request, res: Response) => {
		const {
			params: { id },
			user: { email },
			body,
		} = req as any;
		const data = await urlService.update(id, email, body);
		return res
			.status(StatusCodes.OK)
			.json({ message: "success", data: data });
	};

	public delete = Wrapper(async (req: Request, res: Response) => {
		const {
			params: { id },
			user: { email },
		} = req as any;
		await urlService.delete(id, email);
		return res.status(StatusCodes.OK).json({ message: "success" });
	});
}

export default new UrlController();
