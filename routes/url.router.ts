import express from "express";
import urlController from "../controlllers/url.controller";
import Authenticate from "../middlewears/authenticate";
const Router = express.Router();

Router.route("/url/")
	.get(Authenticate, urlController.getMany)
	.post(Authenticate, urlController.create);
Router.route("/url/:id")
	.get(Authenticate, urlController.getOne)
	.patch(Authenticate, urlController.update)
	.delete(Authenticate, urlController.delete);
// Router.get("/:id", urlController.visit); ! Moved to routes/index.ts file

export default {
	routeUrl: "",
	Router,
};
