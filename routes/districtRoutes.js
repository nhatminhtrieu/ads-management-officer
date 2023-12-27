import express from 'express';
import DistrictService from '../services/DistrictService.js';

const router = express.Router();
const districtService = new DistrictService();

// Create: Checked
router
    .get('/create', (req, res) => {
        res.render('vwAdmin/createDistrict', { layout: 'admin.hbs' });
    })
    .post('/create', async (req, res) => {
        const district = req.body;
        await districtService.addDistrict(district);
        res.redirect('/districts');
    });

// Read: Checked
router
    .get('/', async (req, res) => {
        const result = await districtService.getAllDistricts();
        res.render('vwAdmin/districts', { layout: 'admin.hbs', districts: result });
    });

// Update: Checked
router
    .get('/update', async (req, res) => {
        const { id } = req.query;
        const result = await districtService.getDistrictById(id);
        res.render('vwAdmin/editDistrict', { layout: 'admin.hbs', district: result });
    })
    .post('/update', async (req, res) => {
        const { id } = req.query;
        const newName = req.body.district;
        await districtService.updateDistrict(id, newName);
        res.redirect('/districts');
    });

// Delete: Checked
router
    .post('/delete', async (req, res) => {
        const { id } = req.query;
        await districtService.deleteDistrict(id);
        res.redirect('/districts');
    });

export default router;