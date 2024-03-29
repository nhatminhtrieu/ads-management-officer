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

  async findDataForPage({ offset, limit }, options = {}) {
    try {
      const rawData = await this.repository.findDataForPage({ offset, limit }, options);
      const data = rawData.map((item, index) => {
        const newItem = {
          _id: item._id,
          type: item.type,
          format: item.format.name,
          address: item.address,
          index: offset + index + 1,
        };
        return newItem;
      });
      return data;
    } catch (err) {
      console.log("LocationService.findDataForPage", err);
    }
  }

  async countAll(options = {}) {
    try {
      return await this.repository.countAll(options);
    } catch (err) {
      console.log("LocationService.countAll", err);
    }
  }

  async find(entity) {
    try {
      return await this.repository.find(entity);
    } catch (err) {
      console.log("LocationService.find", err);
    }
  }

  async findAllLocations(entity={}) {
    try {
      return await this.repository.findAll(entity);
    } catch (err) {
      console.log("LocationService.getAllLocations", err);
    }
  }

  async findTotalPages({limit}, options = {}) {
    try {
      const totalItems = await this.countAll(options);
      const totalPages = Math.ceil(totalItems / limit);
      return totalPages;
    } catch (err) {
      console.log("LocationService.findTotalPages", err);
    }
  }

  async generateLocations() {
    try {
      return await this.repository.generate();
    } catch (err) {
      console.log("LocationService.generateLocations", err);
    }
  }

  async updateLocation(id, entity) {
    try {
      return await this.repository.update(id, entity);
    } catch (err) {
      console.log("LocationService.updateLocation", err);
    }
  }

  async deleteLocation(id) {
    try {
      return await this.repository.delete(id);
    } catch (err) {
      console.log("LocationService.deleteLocation", err);
    }
  }
}
