import express from "express";
import AdsTypesService from "../services/AdsTypeService.js";

const router = express.Router();
const adsTypesService = new AdsTypesService();

// UI routers declaration
router.post("/add", async (req, res) => {
  const { name } = req.body;
  const result = await adsTypesService.addAdsType({ name });
  res.json(result);
});

router.post("/delete", async (req, res) => {
  const { name } = req.body;
  const result = await adsTypesService.deleteAdsType({ name });
  res.json(result);
});

router.post("/update", async (req, res) => {
  const { oldName, newName } = req.body;
  const result = await adsTypesService.updateAdsType({ oldName, newName });
  res.json(result);
});

// Data routers declaration
router.post("/find-all", async (req, res) => {
  const result = await adsTypesService.findAllAdsType();
  res.json(result);
});

// ads-type/find?id=...
router.get("/find", async (req, res) => {
  const id = req.query.id;
  const result = await adsTypesService.findAdsTypeById(id);
  res.send(result);
});

export default router;
