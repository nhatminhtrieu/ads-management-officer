import express from "express";
import LocationService from "../services/LocationService.js";

const router = express.Router();
const locationService = new LocationService();

// Data routers declaration
router.get("/generate", async (req, res) => {
  const locations = await locationService.generateLocations();
  res.send(locations);
});

router.post("/add", async (req, res) => {
  const entity = req.body;
  const result = await locationService.createLocation(entity);
  res.send(result);
});

export default router;
