import express from "express";

import CreateRequestService from "../services/CreateRequestService.js";

const Router = express.Router();
const service = new CreateRequestService();

Router.get("/", async (req, res) => {
	const list = await service.getAllCreateRequests();
	res.render("vwAds/vwCreateRequests/list", { layout: "ads", list, empty: list.length === 0 });
});

Router.get("/new", (req, res) => {
	res.render("vwAds/vwCreateRequests/new", { layout: "ads" });
});

Router.post("/new", async (req, res) => {
	await service.addCreateRequest(req.body);
	res.redirect("/advertisement/create-request");
});

export default Router;
