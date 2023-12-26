import express from 'express';
import DistrictService from '../services/DistrictService.js';

const router = express.Router();

const districtService = new DistrictService();

// Create
router.post('/create', async (req, res) => {
    const name = req.body;
    const result = await districtService.addDistrict({ district: name.district });
});

// Read
router.get('/', async (req, res) => {
    const result = await districtService.getAllDistricts();
    res.json(result);
});

router.post("/update", async (req, res) => {
    const { id } = req.query;
    const { newName } = req.body;
    const result = await districtService.updateDistrict(id, newName);
    res.json(result);
});

// Delete
router.post('/delete', async (req, res) => {
    const { id } = req.query;
    const result = await districtService.deleteDistrict(id);
    res.send(result);
});

export default router;