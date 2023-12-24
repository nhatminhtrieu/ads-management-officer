import express from "express";
import BoardTypesService from "../services/BoardTypesService.js";

const router = express.Router();
const boardTypesService = new BoardTypesService();

router.post("/add", async (req, res) => {
    const { name } = req.body;
    const result = await boardTypesService.addBoardType({name});
    res.json(result);
});

router.post("/get-all", async (req, res) => {
    const result = await boardTypesService.getAllBoardTypes();
    res.json(result);
});

router.post("/delete", async (req, res) => {
    const { name } = req.body;
    const result = await boardTypesService.deleteBoardType({name});
    res.json(result);
});

export default router;