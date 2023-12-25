import express from "express";
import BoardTypesService from "../services/AdsTypesService.js";

const router = express.Router();
const boardTypesService = new BoardTypesService();

router.post("/add", async (req, res) => {
    const { name } = req.body;
    const result = await boardTypesService.addAdsType({name});
    res.json(result);
});

router.post("/get-all", async (req, res) => {
    const result = await boardTypesService.getAllAdsTypes();
    res.json(result);
});

router.post("/delete", async (req, res) => {
    const { name } = req.body;
    const result = await boardTypesService.deleteAdsType({name});
    res.json(result);
});

router.post("/update", async (req, res) => {
    const { oldName, newName } = req.body;
    const result = await boardTypesService.updateAdsType({oldName, newName});
    res.json(result);
});

export default router;