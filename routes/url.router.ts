import express from "express";
import urlController from "../controlllers/url.controller";
import { Authenticate, AuthenticatedOnly } from "../middlewears/authenticated";
import { limiter } from ".";
const Router = express.Router();

Router.route("/url/")
	.get(AuthenticatedOnly, limiter, urlController.getMany)
	.post(Authenticate, limiter, urlController.create);
Router.route("/url/:id")
	.get(AuthenticatedOnly, limiter, urlController.getOne)
	.patch(AuthenticatedOnly, urlController.update)
	.delete(AuthenticatedOnly, urlController.delete);
// Router.get("/:id", urlController.visit); ! Moved to routes/index.ts file

export default {
	routeUrl: "",
	Router,
};
