import LocationRepository from "../database/repositories/LocationRepository.js";

export default class LocationService {
  constructor() {
    this.repository = new LocationRepository();
  }

  async createLocation(entity) {
    try {
      const location = await this.repository.add(entity);
      return location;
    } catch (err) {
      console.log("LocationService.createLocation", err);
    }
  }

  async findDataForPage({ offset, limit }) {
    try {
      const rawData = await this.repository.findDataForPage({ offset, limit });
      const data = rawData.map((item, index) => {
        const newItem = {
          type: item.type,
          format: item.format.name,
          address: item.address,
          index: offset + index + 1,
        };
        return newItem;
      });
      console.log("Service:", data);

      return data;
    } catch (err) {
      console.log("LocationService.findDataForPage", err);
    }
  }

  async countAll() {
    try {
      return await this.repository.countAll();
    } catch (err) {
      console.log("LocationService.countAll", err);
    }
  }

  async generateLocations() {
    try {
      return await this.repository.generate();
    } catch (err) {
      console.log("LocationService.generateLocations", err);
    }
  }
}
