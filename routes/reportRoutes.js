import express from "express";
const router = express.Router();
import ReportTypeService from "../services/ReportTypeService.js";
import ReportService from "../services/ReportService.js";
import { pagination } from "../utils/pagination.js";
import moment from "moment";

const apiKey = process.env.GOOGLE_API_KEY;
const reportService = new ReportService();
const reportTypeService = new ReportTypeService();

// UI routers declaration
router.get("/", async (req, res) => {
	const limit = parseInt(req.query.limit) || 10;
	const paginatedReports = await pagination(req, reportService, limit);

	for (let report of paginatedReports.data) {
		// Populate the typeReport field
		report.typeReport = await reportTypeService.getReportTypeById(report.typeReport);

		const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${report.coordinate.lat},${report.coordinate.lng}&key=${apiKey}`);
		const data = await response.json();
		if (data.results[0]) {
			report.address = data.results[0].formatted_address;
		}
	}

	res.render("vwReports/reports", {
		layout: "report",
		reports: paginatedReports.data,
		pageNumbers: paginatedReports.pageNumbers,
		prev_value: paginatedReports.page - 1,
		next_value: paginatedReports.page + 1,
		prev_disabled: paginatedReports.page === 1,
		next_disabled: paginatedReports.page === paginatedReports.totalPage,
	});
});

router.get('/manage/:id', async (req, res) => {
	const id = req.params.id;
	const report = await reportService.findReportById(id);
	const reportTypes = await reportTypeService.getAllReportTypes();
	report.typeReport = await reportTypeService.getReportTypeById(report.typeReport);
	report.typeReportName = report.typeReport.name;

	const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${report.coordinate.lat},${report.coordinate.lng}&key=${apiKey}`);
	const data = await response.json();
	if (data.results[0]) {
		report.address = data.results[0].formatted_address;
	}

	console.log(report.imgs);

	res.render('vwReports/detail', {
		layout: 'report',
		report,
		reportTypes,
		formatDays: {
			createDate: moment(report.createAt).format('DD/MM/YYYY'),
		}
	});
});

router.post('/manage/:id', async (req, res) => {

});

router.get("/type-report", async (req, res) => {
	const list = await reportTypeService.getAllReportTypes();
	res.render("vwReports/typeReport", {
		layout: "report",
		list,
	});
});

router.get("/statistic", (req, res) => {
	res.render("vwReports/statistic", { layout: "report" });
});

// Data routers declaration
router.get("/all", async (req, res) => {
	const list = await reportTypeService.getAllReports();
	res.send(list);
});

export default router;
