import express from "express";
import DistrictService from "../services/DistrictService.js";

const router = express.Router();
const districtService = new DistrictService();

// Create: Checked
router.post("/create", async (req, res) => {
	try {
		const district = req.body;
		await districtService.addDistrict(district);
		res.json({ success: true });
	} catch (error) {
		console.error(error);
		res.json({ success: false });
	}
});

// Read: Checked
router.get("/", async (req, res) => {
	try {
		const result = await districtService.getAllDistricts();
		res.render("vwAdmin/districts", { layout: "admin.hbs", districts: result });
	} catch (error) {
		console.error(error);
		res.status(500).send("An error occurred while getting all districts");
	}
});

// // Update: Checked
// router
//     .get('/update', async (req, res) => {
//         try {
//             const { id } = req.query;
//             const result = await districtService.getDistrictById(id);
//             res.render('vwAdmin/editDistrict', { layout: 'admin.hbs', district: result });
//         } catch (error) {
//             console.error(error);
//             res.status(500).send("An error occurred while getting the district");
//         }
//     })
//     .post('/update', async (req, res) => {
//         try {
//             const { id } = req.query;
//             const newName = req.body.district;
//             await districtService.updateDistrict(id, newName);
//             res.redirect('/districts');
//         } catch (error) {
//             console.error(error);
//             res.status(500).send("An error occurred while updating the district");
//         }
//     });

// // Delete: Checked
// router
//     .post('/delete', async (req, res) => {
//         try {
//             const { id } = req.query;
//             await districtService.deleteDistrict(id);
//             res.redirect('/districts');
//         } catch (error) {
//             console.error(error);
//             res.status(500).send("An error occurred while deleting the district");
//         }
//     });

router.post("/update/:id", async (req, res) => {
	try {
		const districtId = req.params.id;
		const districtName = req.body.district;
		const result = await districtService.updateDistrict(districtId, districtName);
		if (result)
			res.json({ success: true });
	} catch (error) {
		console.error(error);
		return res.json({ success: false });
	}
});

router.post("/delete/:id", async (req, res) => {
	try {
		const districtId = req.params.id;
		const result = await districtService.deleteDistrict(districtId);
		if (result)
			res.json({ success: true });
	} catch (error) {
		console.error(error);
		return res.json({ success: false });
	}
});

export default router;
