// Define your routes here
import express from "express";
const router = express.Router();
import AdvertisementService from "../services/AdvertisementService.js";
import AdsTypesService from "../services/AdsTypesService.js";
import createRequestRouter from "./createRequestRoute.js";

router.get("/locations", async (req, res) => {
	const service = new AdvertisementService();
	const locations = await service.getAllLocations();
	res.send(locations);
});

router.get("/", async (req, res) => {
	const service = new AdvertisementService();
	const coordinate = {
		lat: req.query.lat,
		lng: req.query.lng,
	};
	const list = await service.getAdvertisementsByLocation(coordinate);
	res.send(list);
});

router.get("/manage", (req, res) => {
	res.render("vwAds/ads", { layout: "ads" });
});

router.get("/ad-location", (req, res) => {
	res.render("vwAds/locations", { layout: "ads" });
});

router.get("/edit-request", (req, res) => {
	res.render("vwAds/editRequests", { layout: "ads" });
});

router.use("/create-request", createRequestRouter);

router.get("/type-ad", async (req, res) => {
	const service = new AdsTypesService();
	const list = await service.getAllAdsTypes();
	res.render("vwAds/typeAds", {
		layout: "ads",
		list,
	});
});

export default router;
