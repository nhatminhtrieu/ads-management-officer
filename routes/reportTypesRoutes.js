import express from "express";
import ReportTypesService from "../services/ReportTypesService.js";

const router = express.Router();
const reportTypesService = new ReportTypesService();

router.post("/add", async (req, res) => {
    const { name } = req.body;
    const result = await reportTypesService.addReportType({name});
    res.json(result);
});

router.post("/get-all", async (req, res) => {
    const result = await reportTypesService.getAllReportTypes();
    res.json(result);
});

router.post("/delete", async (req, res) => {
    const { name } = req.body;
    const result = await reportTypesService.deleteReportType({name});
    res.json(result);
});

router.post("/update", async (req, res) => {
    const { oldName, newName } = req.body;
    const result = await reportTypesService.updateReportType({oldName, newName});
    res.json(result);
});

export default router;