import express from "express";
import DistrictService from "../services/DistrictService.js";

const router = express.Router();
const districtService = new DistrictService();

router.get("/", (req, res) => {
	res.redirect("/officers");
});

router.get("/officer", (req, res) => {
	res.render("vwAdmin/officers", { layout: "admin" });
});

router.get("/area", async (req, res) => {
	try {
		const result = await districtService.getAllDistricts();
		return res.render("vwAdmin/areas", { layout: "admin", districts: result });
	} catch (error) {
		console.error(error);
		return res.status(500).send("An error occurred while getting all districts");
	}
});

export default router;
