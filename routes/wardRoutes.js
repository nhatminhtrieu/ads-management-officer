import express from 'express';
import WardService from '../services/WardService.js';
import DistrictService from '../services/DistrictService.js';

const router = express.Router();

const wardService = new WardService();
const districtService = new DistrictService();

function paginate(array, page, limit) {
    const skip = (page - 1) * limit;
    const items = array.slice(skip, skip + limit);
    const totalPages = Math.ceil(array.length / limit);
    const pages = Array.from({ length: totalPages }, (_, i) => ({
        number: i + 1,
        isCurrent: i + 1 === page,
    }));

    return { items, pages, totalPages };
}

// Read all as district officer
router.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const limit = 10;
    const allWards = await wardService.getAllWards();

    // Check if page number is valid
    if (isNaN(page) || page < 1) {
        page = 1;
    }

    const totalPages = Math.ceil(allWards.length / limit);

    // Check if page number is out of range
    if (page > totalPages) {
        page = totalPages;
    }

    // Slice the array of wards to get only the wards for the current page
    const wards = allWards.slice((page - 1) * limit, page * limit);

    // Add index to each ward
    wards.forEach((ward, index) => {
        ward.index = (page - 1) * limit + index + 1;
    });

    const firstPageDisabled = page === 1;
    const lastPageDisabled = page === totalPages;

    const district = await districtService.getAllDistricts();

    return res.render('vwAdmin/wards', {
        layout: 'admin',
        ward: wards,
        district: district,
        isWardList: true,
        pages: Array.from({ length: totalPages }, (_, i) => i + 1).map((number, index) => {
            return {
                number: number,
                isCurrent: index + 1 === page
            };
        }),
        totalPages,
        firstPage: 1,
        lastPage: totalPages,
        firstPageDisabled,
        lastPageDisabled,
        currentPage: page
    });
});

// /wards/658955201284436f7935f8d2
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let page = parseInt(req.query.page) || 1;
        const limit = 5;
        const allWards = await wardService.getAllWardsByDistrict(id);

        // Check if page number is valid
        if (isNaN(page) || page < 1) {
            page = 1;
        }

        const totalPages = Math.ceil(allWards.length / limit);

        // Check if page number is out of range
        if (page > totalPages) {
            page = totalPages;
        }

        // Slice the array of wards to get only the wards for the current page
        const wards = allWards.slice((page - 1) * limit, page * limit);

        // Add index to each ward
        wards.forEach((ward, index) => {
            ward.index = (page - 1) * limit + index + 1;
        });

        const district = await districtService.getDistrictById(id);
        const firstPageDisabled = page === 1;
        const lastPageDisabled = page === totalPages;

        return res.render('vwAdmin/wards', {
            layout: 'admin',
            ward: wards,
            district: district,
            isWardList: false,
            pages: Array.from({ length: totalPages }, (_, i) => ({ number: i + 1, isCurrent: i + 1 === page })),
            totalPages,
            firstPage: 1,
            lastPage: totalPages,
            firstPageDisabled,
            lastPageDisabled,
            currentPage: page
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