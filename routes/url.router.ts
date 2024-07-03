import express from "express";
import urlController from "../controlllers/url.controller";
const Router = express.Router();

Router.get("/:id", urlController.visit);
Router.route("/url/").get(urlController.getMany).post(urlController.create);
Router.route("/url/:id")
	.get(urlController.getOne)
	.patch(urlController.update)
	.delete(urlController.delete);

export default {
	routeUrl: "",
	Router,
};
