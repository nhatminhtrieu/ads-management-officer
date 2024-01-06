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
	const { _id } = req.session.authUser;
	const list = (await service.getAllAccount()).filter((item) => item._id != _id);
	res.render("vwAdmin/officers", { 
		length: list.length,
		list,
		layout: "admin" 
	});
});

router.get("/officer/:id", async(req, res) => {
	const id = req.params.id;
	const officer = await service.findById(id);
	const data = officer.toObject();
	
	if(data.dob) data.dob = formatDate(data.dob);

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

router.get("/createAccount", async (req, res) => {
	const districtList = await districtService.getAllDistricts();
	var err_message = "", success_message = "";
	if (req.session.createAccount == true) {
		success_message = "Tạo tài khoản thành công";
	} else if (req.session.createAccount == false) {
		err_message = "Tên tài khoản đã tồn tại";
	}

	req.session.createAccount = null;
	res.render("vwAdmin/createAccount", { 
		districtList,
		err_message,
		success_message,
		layout: "admin" 
	});
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

router.post("/createAccount", async (req, res) => {
	const { username, password, role, district, ward } = req.body;
	const result = await service.createAccount({username, password, role, district, ward});
	
	req.session.createAccount = result == true ? true : false;
	res.redirect("/createAccount");
})

router.put("/officer/updateArea", async (req, res) => {
	const { _id, district, ward } = req.body;
	await service.updateProfile(_id, { district, ward });
	return res.json({ success: true });
})

router.delete("/officer/deleteAccount", async (req, res) => {
	const { _id } = req.body;

	await service.deleteAccount(_id);
	return res.json({ success: true });
})
export default router;
