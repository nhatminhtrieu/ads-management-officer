import express from "express";
import LocationService from "../services/LocationService.js";
import AdvertisementService from "../services/AdvertisementService.js";
import ReportService from "../services/ReportService.js";

const router = express.Router();

router.get("/location", async (req, res) => {
	const locationService = new LocationService();
	const result = await locationService.findAllLocations();
	res.send(result);
});

router.get("/advertisement", async (req, res) => {
	const id = req.query.location;
	const service = new AdvertisementService();
	const list = await service.getAllAdvertisementsByLocationId(id);
	res.send(list);
});

router.get("/report", async (req, res) => {
	const service = new ReportService();
	const list = await service.getAllReports();
	res.send(list);
});

router.get("/report/detail", async (req, res) => {
	const id = req.query.id;
	const service = new ReportService();
	const report = await service.findReportById(id);
	res.send(report);
});

router.post("/report/create", async (req, res) => {
	const service = new ReportService();
	const report = await service.createReport(req.body);
	res.send(report);
});

export default router;
