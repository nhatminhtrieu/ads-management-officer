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

// location/find/...
router.get("/find/:id", async (req, res) => {
  const id = req.params.id;
  const result = await locationService.find({ _id: id });
  res.send(result[0]);
});

router.get("/find-all", async (req, res) => {
  const result = await locationService.findAllLocations();
  res.send(result);
});

export default router;
