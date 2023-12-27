import express from 'express';
import WardService from '../services/WardService.js';

const router = express.Router();

const wardService = new WardService();

// Create
router.post('/create', async (req, res) => {
    const { wardName, districtID } = req.body;
    const result = await wardService.addWard({ ward: wardName, district: districtID });
    res.redirect('/wards');
})
// /wards/658955201284436f7935f8d2
router.get('/:id', async (req, res) => {
    const { id } = req.params;   // id = districtID
    const result = await wardService.getAllWardsByDistrict(id);
    if (!result) {
        return res.status(404).send("Ward not found");
    }
    return res.render('vwWard/wards', { layout: 'admin.hbs', ward: result });
})

// Read all as district officer
router.get('/', async (req, res) => {
    const result = await wardService.getAllWards(); // get all wards for admin
    console.log(result);
    if (!result) {
        return res.status(404).send("Ward not found");
    }
    return res.render('vwWard/wards', { layout: 'admin.hbs', ward: result });
})

router.post("/update", async (req, res) => {
    const { id, districtID } = req.query;
    const { newName } = req.body;
    const result = await wardService.updateWard(id, districtID, newName);
    res.json(result);
})

router.post('/delete', async (req, res) => {
    const { id, districtID } = req.query;
    const result = await wardService.deleteWard(id, districtID);
    res.redirect('/wards');
})

export default router;