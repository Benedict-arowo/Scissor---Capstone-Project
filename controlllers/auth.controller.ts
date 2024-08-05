import { Request, Response } from "express";
import authService from "../services/auth.service";
import Wrapper from "../middlewears/wrapper";
import validator from "../middlewears/validators";
import { AuthSchema } from "../middlewears/validators/auth.validator";

class AuthController {
	public login = Wrapper(async (req: Request, res: Response) => {
		validator(AuthSchema, req.body);
		const {
			body: { email, password },
		} = req;
		const user = await authService.login(email, password);
		return res.json({
			message: "Login successful",
			data: user,
		});
	});

	public register = Wrapper(async (req: Request, res: Response) => {
		validator(AuthSchema, req.body);
		const {
			body: { email, password },
		} = req;
		console.log(email, password);
		const user = await authService.register(email, password);

		return res.json({
			message: "Registration successful",
			data: user,
		});
	});
}

export default new AuthController();
