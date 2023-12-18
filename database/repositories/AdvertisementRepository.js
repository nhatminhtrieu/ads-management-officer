import AdvertisementModel from "../models/Advertisement.js";

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
      console.err("getAllAdvertisements", err);
      throw err;
    }
  }

  async getAdvertisementsByCoordinate(position) {
    try {
      const coordinate = {
        lat: Number(position.lat),
        lng: Number(position.lng),
      };
      return await this.model.find({ coordinate: coordinate });
    } catch (err) {
      console.err("getAllAdvertisementsByCoordinate", err);
      throw err;
    }
  }
}

export default AdvertisementRepository;
