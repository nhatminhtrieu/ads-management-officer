import express from "express";
import LocationService from "../services/LocationService.js";
import mongoose from 'mongoose';
const router = express.Router();

router.get("/", async (req, res) => {
	const service = new LocationService();
	let locations = [];

	// Role: Department Officer
	if (req.session.authUser.role === 3) {
		locations = await service.findAllLocations();
	}
	// Role: District Officer
	if (req.session.authUser.role === 2) {
		// Fav_list == [] -> all
		if (req.session.authUser.fav_list.length === 0)
			locations = await service.find({
				"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
			});
		else {
			let fav_list_ids = [];
			req.session.authUser.fav_list.forEach((id) => {
				fav_list_ids.push(new mongoose.Types.ObjectId(id));
			});

			locations = await service.find({
				"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
				"area.ward": { $in: fav_list_ids },
			});
		}
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
	
	res.render("vwHome/home", { layout: "main", locations });
});

export default router;
