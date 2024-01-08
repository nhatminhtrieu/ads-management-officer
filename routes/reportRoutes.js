import express from "express";
const router = express.Router();
import ReportTypeService from "../services/ReportTypeService.js";
import ReportService from "../services/ReportService.js";
import { authDepartmentRole } from "../middleware/auth.js";

// UI routers declaration
router.get("/", (req, res) => {
	res.render("vwReports/reports", { layout: "report" });
});

router.get("/type-report", authDepartmentRole, async (req, res) => {
	const service = new ReportTypeService();
	const list = await service.getAllReportTypes();
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
	const service = new ReportService();
	const list = await service.getAllReports();
	res.send(list);
});

export default router;
