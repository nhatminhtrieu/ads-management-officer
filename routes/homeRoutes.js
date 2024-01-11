import express from "express";
import LocationService from "../services/LocationService.js";
import ReportService from "../services/ReportService.js";
import ReportTypesService from "../services/ReportTypeService.js";
import mongoose from 'mongoose';
const router = express.Router();

import auth from "../middleware/auth.js";
const apiKey = process.env.GOOGLE_API_KEY;

router.get("/", auth, async (req, res) => {
	const locationService = new LocationService();
	const reportService = new ReportService();
	const reportTypeService = new ReportTypesService();
	let locations = [];
	let reports = [];

	// Role: Department Officer
	if (req.session.authUser.role === 3) {
		locations = await locationService.findAllLocations();
		reports = await reportService.getAllReports();
	}
	// Role: District Officer
	if (req.session.authUser.role === 2) {
		// Fav_list == [] -> all
		if (req.session.authUser.fav_list.length === 0) {
			locations = await locationService.find({
				"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
			});
			reports = await reportService.find({
				"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
			});
		}
		else {
			let fav_list_ids = [];
			req.session.authUser.fav_list.forEach((id) => {
				fav_list_ids.push(new mongoose.Types.ObjectId(id));
			});
			locations = await locationService.find({
				"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
				"area.ward": { $in: fav_list_ids },
			});

			reports = await reportService.find({
				"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
				"area.ward": { $in: fav_list_ids },
			});
		}

	}
	// Role: Ward Officer
	else if (req.session.authUser.role === 1) {
		locations = await locationService.find({
			area: {
				district: new mongoose.Types.ObjectId(req.session.authUser.district),
				ward: new mongoose.Types.ObjectId(req.session.authUser.ward)
			}
		});
		reports = await reportService.find({
			area: {
				district: new mongoose.Types.ObjectId(req.session.authUser.district),
				ward: new mongoose.Types.ObjectId(req.session.authUser.ward)
			}
		});
	}
	if (reports === null) reports = [];
	if (!Array.isArray(reports)) reports = [reports];
	if (reports.length > 0) {
		reports = await Promise.all(reports.map(async (report) => {
			const reportType = (await reportTypeService.getReportTypeById(report.typeReport)).toObject();
			const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${report.coordinate.lat},${report.coordinate.lng}&key=${apiKey}`);
			const data = await response.json();
			const address = data.results[0] ? data.results[0].formatted_address : "";
			const reportData = report instanceof mongoose.Document ? report.toObject() : report;
			const newItem = {
				...reportData,
				typeReportName: reportType.name,
				address
			};
			return newItem;
		}));
	}
	res.render("vwHome/home", { layout: "main", locations, reports });
});

export default router;
