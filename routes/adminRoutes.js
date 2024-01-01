import express from "express";
import auth from "../middleware/auth.js";
import { formatDate } from "../utils/time.js";

import AccountService from "../services/AccountService.js";
import DistrictService from "../services/DistrictService.js";
import WardService from "../services/WardService.js";


const router = express.Router();
const service = new AccountService();
const districtService = new DistrictService();
const wardService = new WardService();

router.get("/", (req, res) => {
	res.redirect("/officers");
});

router.get("/officer", async (req, res) => {
	const list = await service.getAllAccount();
	res.render("vwAdmin/officers", { 
		length: list.length,
		list: list.map((item) => item.toObject()),
		layout: "admin" 
	});
});

router.get("/officer/:id", async(req, res) => {
	const id = req.params.id;
	const officer = await service.findById(id);
	const data = officer.toObject();
	data.dob = formatDate(data.dob);

	if (officer.district) {
		var district = await districtService.getDistrictById(officer.district.toString());
		if(district) {
			district = district.toObject()
			district._id = district._id.toString()
		}
		data.district = district
	}

	if (officer.ward) {
		var ward = await wardService.getWardById(officer.ward.toString());
		if(ward) {
			ward = ward.toObject()
			ward._id = ward._id.toString()
		}
		data.ward = ward
	}

	var districtList = await districtService.getAllDistricts();
	districtList = districtList.map((item) => item.toObject());
	districtList.forEach((item) => {
		item._id = item._id.toString()
	})

	res.render("vwAdmin/officerDetail", {
		officer: data,
		districtList,
		layout: "admin"
	})
})

router.get("/area", async (req, res) => {
	try {
		const result = await districtService.getAllDistricts();
		return res.render("vwAdmin/areas", { layout: "admin", districts: result });
	} catch (error) {
		console.error(error);
		return res.status(500).send("An error occurred while getting all districts");
	}
});

router.put("/officer/updateArea", async (req, res) => {
	const { _id, district, ward } = req.body;
	await service.updateProfile(_id, { district, ward });
	return res.json({ success: true });
})
export default router;
