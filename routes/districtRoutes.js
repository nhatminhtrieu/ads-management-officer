import express from 'express';
import DistrictService from '../services/DistrictService.js';

const router = express.Router();
// CRUD

const districtService = new DistrictService();

// Create
router.post('/create', async (req, res) => {
    const name = req.body;
    console.log(name.district)
    const result = await districtService.addDistrict({ district: name.district });
    console.log(result);
});

// Read
router.get('/', async (req, res) => {
    const result = await districtService.getAllDistricts();
    res.send(result);
});

// Update
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await districtService.updateDistrict({ id, data });
    res.send(result);
});

// Delete
router.delete('/delete', async (req, res) => {
    const { id } = req.body;
    const result = await districtService.deleteDistrict({ id });
    res.send(result);
});

export default router;