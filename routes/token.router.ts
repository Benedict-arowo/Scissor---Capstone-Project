import express, { Request, Response } from "express";
import tokenController from "../controlllers/token.controller";
const Router = express.Router();

Router.post("/", tokenController.create);
Router.route("/:id").put(tokenController.update).delete(tokenController.delete);

export default {
	routeUrl: "token",
	Router,
};
