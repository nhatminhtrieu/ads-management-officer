import express from "express";

import CreateRequestService from "../services/CreateRequestService.js";

const Router = express.Router();
const service = new CreateRequestService();

// UI routers declaration
Router.get("/", async (req, res) => {
	const list = await service.getAllCreateRequests();
	res.render("vwAds/vwCreateRequests/list", { layout: "ads", list, empty: list.length === 0 });
});

Router.get("/create", (req, res) => {
	res.render("vwAds/vwCreateRequests/create", { layout: "ads" });
});

Router.get("/detail", async (req, res) => {
	const id = req.query.id;
	const request = await service.findById(id);
	if (request === null) res.redirect("/advertisement/create-request");
	else {
		res.render("vwAds/vwCreateRequests/detail", { layout: "ads", request });
	}
});

// Data routers declaration
Router.post("/create", async (req, res) => {
	await service.createRequest(req.body);
	res.redirect("/advertisement/create-request");
});

Router.post("/delete", async (req, res) => {
	await service.deleteCreateRequest(req.body.id);
	res.redirect("/advertisement/create-request");
});

Router.post("/approve", async (req, res) => {
	await service.approveCreateRequest(req.body.id);
	res.redirect("/advertisement/create-request");
});

Router.post("/reject", async (req, res) => {
	await service.rejectCreateRequest(req.body.id);
	res.redirect("/advertisement/create-request");
});

export default Router;
