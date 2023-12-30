import AdvertisementModel from "../models/Advertisement.js";
import generateAdvertisement from "../utils/generateAdvertisement.js";
import LocationRepository from "./LocationRepository.js";

class AdvertisementRepository {
  constructor() {
    this.model = AdvertisementModel;
  }
  async createAdvertisement(advertisement) {
    const newAdvertisement = new AdvertisementModel(advertisement);
    return await newAdvertisement.save();
  }

  async getAllAdvertisements() {
    try {
      return await this.model.find({});
    } catch (err) {
      console.error("getAllAdvertisement", err);
      throw err;
    }
  }

  async getAdvertisementsByCoordinate(position) {
    try {
      const coordinate = {
        lat: Number(position.lat),
        lng: Number(position.lng),
      };
      const repository = new LocationRepository();
      const location = await repository.find({ coordinate });
      return await this.model.find({ location: location._id });
    } catch (err) {
      console.err("getAllAdvertisementsByCoordinate", err);
      throw err;
    }
  }

  async generate() {
    return await generateAdvertisement();
  }

  async canBeDeleted(id) {
    try {
      const list = await this.model.find({}).populate("location");

      for (const item of list) {
        if (item.location && item.location._id.toString() === id) {
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error("canBeDeleted", err);
      throw err;
    }
  }
}

export default AdvertisementRepository;
