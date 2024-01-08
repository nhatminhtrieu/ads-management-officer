import express from "express";
import LocationService from "../services/LocationService.js";
import mongoose from 'mongoose';
const router = express.Router();

router.get("/", async (req, res) => {
	const service = new LocationService();
	let locations = [];

	console.log(req.session.authUser)
	// console.log(typeof req.session.role)

	// Role: Department Officer
	if (req.session.authUser.role === 3) {
		locations = await service.findAllLocations();
	}
	// Role: District Officer
	if (req.session.authUser.role === 2) {
		locations = await service.find({ 
			"area.district": new mongoose.Types.ObjectId(req.session.authUser.district)
		});
	}
	// Role: Ward Officer
	else if (req.session.authUser.role === 1) {
		locations = await service.find({
			area: { 
				district: new mongoose.Types.ObjectId(req.session.authUser.district), 
				ward: new mongoose.Types.ObjectId(req.session.authUser.ward)
			}
		});
	}
	console.log(locations)
	
	res.render("vwHome/home", { layout: "main", locations });
});

export default router;
