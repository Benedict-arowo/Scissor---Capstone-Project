import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import urlService from "../services/url.service";
import UAParser from "ua-parser-js";
import Wrapper from "../middlewears/wrapper";
import redisClient, {
	deleteKeysByPattern,
	getRedisKey,
} from "../middlewears/redis_client";
import validator from "../middlewears/validators";
import {
	CreateURLSchema,
	UpdateURLSchema,
} from "../middlewears/validators/url.validator";

class UrlController {
	public create = Wrapper(async (req: Request, res: Response) => {
		validator(CreateURLSchema, req.body);
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
			params: { page, limit },
		} = req as any;
		console.log(getRedisKey(req));
		const data = await urlService.getMany(email, { page, limit });
		redisClient.set(
			getRedisKey(req),
			JSON.stringify({ message: "success", data }),
			{
				EX: 60 * 60 * 12, // 12 hours
			}
		);
		return res.status(StatusCodes.OK).json({ message: "success", data });
	});

	public getOne = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
			params: { id: url_id },
		} = req as any;
		const data = await urlService.getOne(email, url_id);
		redisClient.set(
			getRedisKey(req),
			JSON.stringify({ message: "success", data }),
			{
				EX: 60 * 60 * 12, // 12 hours
			}
		);
		return res.status(StatusCodes.OK).json({ message: "success", data });
	});

	public visit = Wrapper(async (req: Request, res: Response) => {
		const { id } = req.params;
		console.log(req.url);
		const parsed_user_agent = UAParser(req.headers["user-agent"]);

		const data = await urlService.visit(id, {
			...parsed_user_agent,
			ip: req.ip,
		});

		return res.render("redirect", { url: data.url, is_safe: data.is_safe });
	});

	public update = Wrapper(async (req: Request, res: Response) => {
		validator(UpdateURLSchema, req.body);
		const {
			params: { id },
			user: { email },
			body,
		} = req as any;
		const data = await urlService.update(id, email, body);
		// Removes the cached data if it exists about the user, and the updated data
		const cacheKey = getRedisKey(req);
		if (await redisClient.get(cacheKey)) {
			redisClient.del(getRedisKey(req));
			deleteKeysByPattern(`/url|+|${email}*`);
		}
		return res
			.status(StatusCodes.OK)
			.json({ message: "success", data: data });
	});

	public delete = Wrapper(async (req: Request, res: Response) => {
		const {
			params: { id },
			user: { email },
		} = req as any;
		await urlService.delete(id, email);
		// Removes the cached data if it exists about the user, and the updated data
		const cacheKey = getRedisKey(req);
		if (await redisClient.get(cacheKey)) {
			redisClient.del(getRedisKey(req));
			deleteKeysByPattern(`/url|+|${email}*`);
		}
		return res.status(StatusCodes.OK).json({ message: "success" });
	});
}

export default new UrlController();
