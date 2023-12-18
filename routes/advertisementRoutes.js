// Define your routes here
import express from "express";
const router = express.Router();
import AdvertisementService from "../services/AdvertisementService.js";

router.get("/locations", async (req, res) => {
  const service = new AdvertisementService();
  const locations = await service.getAllLocations();
  res.send(locations);
});

router.get("/", async (req, res) => {
  const service = new AdvertisementService();
  const coordinate = {
    lat: req.query.lat,
    lng: req.query.lng,
  };
  const list = await service.getAdvertisementsByLocation(coordinate);
  res.send(list);
});

export default router;
