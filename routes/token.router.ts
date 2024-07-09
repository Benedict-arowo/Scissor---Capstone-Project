import express from "express";
import tokenController from "../controlllers/token.controller";
import Authenticate from "../middlewears/authenticate";
const Router = express.Router();

Router.route("/")
	.post(Authenticate, tokenController.create)
	.put(Authenticate, tokenController.update)
	.delete(Authenticate, tokenController.delete);

export default {
	routeUrl: "token",
	Router,
};
