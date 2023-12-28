import express from 'express';
import WardService from '../services/WardService.js';
import DistrictService from '../services/DistrictService.js';

const router = express.Router();

const wardService = new WardService();
const districtService = new DistrictService();

// Read all as district officer
router
    .get('/', async (req, res) => {
        const result = await wardService.getAllWards(); // get all wards for admin
        if (!result) {
            return res.status(404).send("Ward not found");
        }
        return res.render('vwWard/wards', { layout: 'admin.hbs', ward: result });
    })

// Create
router
    .get('/create', async (req, res) => {
        try {
            const districts = await districtService.getAllDistricts();
            res.render('vwWard/createWard', { layout: 'admin.hbs', districts: districts });
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while getting districts");
        }
    })
    .post('/create', async (req, res) => {
        try {
            const { wardName, districtID } = req.body;
            const result = await wardService.addWard({ ward: wardName, district: districtID });
            res.redirect('/wards');
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while creating the ward");
        }
    })

// /wards/658955201284436f7935f8d2
router
    .get('/', async (req, res) => {
        try {
            const { id } = req.query;
            const result = await wardService.getAllWardsByDistrict(id);
            if (!result) {
                return res.status(404).send("Ward not found");
            }
            return res.render('vwWard/wards', { layout: 'admin.hbs', ward: result });
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    })

// Update
router
    .get("/update", async (req, res) => {
        try {
            const { id, districtID } = req.query;
            const ward = await wardService.getWardById(id);
            const district = await districtService.getDistrictById(districtID);
            res.render('vwWard/editWard', { layout: 'admin.hbs', ward: ward, district: district });
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while getting the ward or district");
        }
    })
    .post("/update", async (req, res) => {
        try {
            const { id, districtID } = req.query;
            const { newName } = req.body;
            const result = await wardService.updateWard(id, districtID, newName);
            res.redirect('/wards');
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while updating the ward");
        }
    })

router.post('/delete', async (req, res) => {
    try {
        const { id, districtID } = req.query;
        await wardService.deleteWard(id, districtID);
        res.redirect('/wards');
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while deleting the ward");
    }
})

export default router;