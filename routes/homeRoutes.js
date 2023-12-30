import express from "express";
import LocationService from "../services/LocationService.js";
const router = express.Router();

router.get("/", async (req, res) => {
	const service = new LocationService();
	const locations = await service.findAllLocations();
	res.render("vwHome/home", { layout: "main", locations });
});

export default router;
