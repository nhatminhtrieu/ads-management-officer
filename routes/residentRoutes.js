import express from "express";
import LocationService from "../services/LocationService.js";
import AdvertisementService from "../services/AdvertisementService.js";
import ReportService from "../services/ReportService.js";
import ReportTypesService from "../services/ReportTypeService.js";

import WardService from "../services/WardService.js";
import DistrictService from "../services/DistrictService.js";

import mongoose from "mongoose";

const apiKey = process.env.GOOGLE_API_KEY;
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
	const { typeReport, coordinate, email, name, phone, content, imgs, resolvedContent, type } = req.body;
	const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.lat},${coordinate.lng}&key=${apiKey}`);
	const data = await response.json();
	let formatted_address = "";
	if (data.results[0]) {
		formatted_address = data.results[0].formatted_address;
	}

	const matchDistrict = formatted_address.match(/Quận\s[^,]*,\s/);
	const district = matchDistrict ? matchDistrict[0].slice(0, -2) : "Quận 5";
	const matchWard = formatted_address.match(/Phường\s[^,]*,\s/);
	const ward = matchWard ? matchWard[0].slice(0, -2) : "Phường 4";

	const wardService = new WardService();
	const districtService = new DistrictService();

	const wardId = await wardService.findWardId({ ward });
	const districtId = await districtService.findDistrictId({ district });
	const typeReportID = new mongoose.Types.ObjectId(typeReport);

	const report = {
		coordinate,
		typeReport: typeReportID,
		email,
		name,
		phone,
		content,
		imgs,
		resolvedContent,
		type,
		area: {
			district: districtId,
			ward: wardId,
		},
	};
	const reportTypeService = new ReportTypesService();
	var result = await service.createReport(report);
	const typeReportInfo = await reportTypeService.getReportTypeById(result.typeReport);
	result = { ...result, typeReportName: typeReportInfo.name };
	res.send(result);
});

router.get('/report-type/get-all', async (req, res) => {
	const service = new ReportTypesService();
	const list = await service.getAllReportTypes();
	res.send(list);
});

export default router;