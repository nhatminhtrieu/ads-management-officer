import AdvertisementRepository from "../database/repositories/AdvertisementRepository.js";

export default class AdvertisementService {
  constructor() {
    this.repository = new AdvertisementRepository();
  }

  async getAllAdvertisements() {
    try {
      const advertisements = await this.repository.getAllAdvertisements();
      return advertisements;
    } catch (err) {
      console.log("AdvertisementService.getAllAdvertisement", err);
    }
  }

  async getAllLocations() {
    try {
      const advertisements = await this.repository.getAllAdvertisements();
      const locations = advertisements.filter((item, pos) => {
        return advertisements.indexOf(item) == pos;
      });
      console.log(locations);
      return locations;
    } catch (err) {
      console.log("AdvertisementService.getAllLocations", err);
    }
  }

  async getAdvertisementsByLocation(coordinate) {
    try {
      const advertisements =
        await this.repository.getAdvertisementsByCoordinate(coordinate);
      return advertisements;
    } catch (err) {
      console.log("AdvertisementService.getAllAdvertisement", err);
    }
  }

  async generateAds() {
    try {
      return await this.repository.generate();
    } catch (err) {
      console.log("AdvertisementService.generateAds", err);
    }
  }

  async canBeDeleted(id) {
    try {
      const result = await this.repository.canBeDeleted(id);
      return result;
    } catch (err) {
      console.log("AdvertisementService.canBeDeleted", err);
    }
  }

  async countAll() {
    try {
      return await this.repository.countAll();
    } catch (err) {
      console.log("AdvertisementService.countAll", err);
    }
  }

  async findTotalPages({ limit }) {
    try {
      const totalItems = await this.countAll();
      const totalPages = Math.ceil(totalItems / limit);
      return totalPages;
    } catch (err) {
      console.log("AdvertisementService.findTotalPages", err);
    }
  }

  async findDataForPage({ offset, limit }) {
    try {
      const rawData = await this.repository.findDataForPage({ offset, limit });
      const data = rawData.map((item, index) => {
        const newItem = {
          _id: item._id,
          typeBoard: item.typeBoard,
          number: item.number,
          size: item.size,
          address: item.location.address,
          index: offset + index + 1,
        };
        return newItem;
      });
      return data;
    } catch (err) {
      console.log("AdvertisementService.findDataForPage", err);
    }
  }

  async find(entity) {
    try {
      return await this.repository.find(entity);
    } catch (err) {
      console.log("AdvertisementService.find", err);
    }
  }

  async createAdvertisement(entity) {
    try {
      const ad = await this.repository.add(entity);
      return ad;
    } catch (err) {
      console.log("AdvertisementService.createAdvertisement", err);
    }
  }

  async updateAdvertisement(id, entity) {
    try {
      return await this.repository.update(id, entity);
    } catch (err) {
      console.log("AdvertisementService.updateAdvertisement", err);
    }
  }
}
