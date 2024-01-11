import express from "express";
import moment from "moment";

import RequestService from "../services/RequestService.js";
import AdvertisementService from "../services/AdvertisementService.js";
import LocationService from "../services/LocationService.js";
import { authDepartmentRole, authNotDepartmentRole } from "../middleware/auth.js";
import { pagination } from "../utils/pagination.js";

const Router = express.Router();
const service = new RequestService();
const advertisementService = new AdvertisementService();
const locationService = new LocationService();

// UI routers declaration
Router.get("/", async (req, res) => {
	const limit = 5;
	let empty = true;
	let options = {};
	if (req.session.authUser.role < 3) {
		options = { createdBy: req.session.authUser._id };
	}
	const result = await pagination(req, service, limit, options);
	if (result.data.length) empty = false;

	res.render("vwAds/vwRequests/requests", {
		layout: "ads",
		empty,
		list: result.data,
		totalPage: result.totalPage,
		page: result.page,
		pageNumbers: result.pageNumbers,
	});
});

Router.get("/create/:id", authNotDepartmentRole, async (req, res) => {
	const id = req.params.id;
	const ads = await advertisementService.find({ _id: id });
	if (ads == undefined) res.redirect("/errors/404");
	else {
		const location = await locationService.find({ _id: ads[0].location });
		res.render("vwAds/vwRequests/create", { layout: "ads", ad: ads[0], location: location[0] });
	}
});

Router.get("/detail", async (req, res) => {
	const id = req.query.id;
	const request = await service.findById(id);
	if (request === null) res.redirect("/advertisement/request");
	else {
		res.render("vwAds/vwRequests/detail", { layout: "ads", request });
	}
});

// Data routers declaration
Router.post("/create/:id", authNotDepartmentRole, async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	data.advertisement = id;
	data.createdBy = req.session.authUser._id;
	data.start = moment(data.start, "DD/MM/YYYY").toDate();
	data.end = moment(data.end, "DD/MM/YYYY").toDate();
	await service.createRequest(data);
	res.redirect("/advertisement/request");
});

Router.post("/delete", async (req, res) => {
	await service.deleteRequest(req.body.id);
	res.redirect("/advertisement/request");
});

Router.post("/approve", authDepartmentRole, async (req, res) => {
	await service.approveRequest(req.body.id);
	await advertisementService.updateAdvertisement(req.body.advertisement, { used: req.body.id });
	res.redirect("/advertisement/request");
});

Router.post("/reject", authDepartmentRole, async (req, res) => {
	await service.rejectRequest(req.body.id);
	res.redirect("/advertisement/request");
});

export default Router;
