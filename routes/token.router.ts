import express from "express";
import tokenController from "../controlllers/token.controller";
import { AuthenticatedOnly } from "../middlewears/authenticated";
import { limiter } from ".";
const Router = express.Router();

Router.route("/")
	.post(AuthenticatedOnly, limiter, tokenController.create)
	.delete(AuthenticatedOnly, tokenController.delete);

export default {
	routeUrl: "token",
	Router,
};
