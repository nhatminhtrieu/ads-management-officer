import express from 'express';
import WardService from '../services/WardService.js';
import DistrictService from '../services/DistrictService.js';

const router = express.Router();

const wardService = new WardService();
const districtService = new DistrictService();

function paginate(array, page, limit) {
    const skip = (page - 1) * limit;
    const items = array.slice(skip, skip + limit);
    const pages = Array.from({ length: Math.ceil(array.length / limit) }, (_, i) => ({
        number: i + 1,
        isCurrent: i + 1 === page,
    }));

    return { items, pages };
}

// Read all as district officer
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const allWards = await wardService.getAllWards();
    const { items: wards, pages } = paginate(allWards, page, limit);

    const district = await districtService.getAllDistricts();

    return res.render('vwAdmin/wards', {
        layout: 'admin',
        ward: wards,
        district: district,
        isWardList: true,
        pages: pages
    });
});

// /wards/658955201284436f7935f8d2
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const allWards = await wardService.getAllWardsByDistrict(id);
        const { items: wards, pages } = paginate(allWards, page, limit);
        const district = await districtService.getDistrictById(id);

        if (!wards.length) {
            return res.status(404).send("Ward not found");
        }

        return res.render('vwAdmin/wards', {
            layout: 'admin',
            ward: wards,
            district: district,
            isWardList: false,
            pages: pages
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Create
router.post('/create', async (req, res) => {
    try {
        const { ward, district } = req.body;
        const result = await wardService.addWard({ ward: ward, district: district });
        if (result)
            return res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
})

// Update
// /wards/update?id=id&districtID=districtID
router.post("/update", async (req, res) => {
    try {
        const { id, districtID } = req.query;
        const { ward } = req.body;

        const result = await wardService.updateWard(id, districtID, ward);
        if (result)
            return res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
})

// Delete
// /wards/delete?id=id&districtID=districtID
router.post('/delete', async (req, res) => {
    try {
        const { id, districtID } = req.query;
        const result = await wardService.deleteWard(id, districtID)
        if (result)
            return res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
})

export default router;