import LocationRepository from "../database/repositories/LocationRepository.js";

export default class LocationService {
  constructor() {
    this.repository = new LocationRepository();
  }

  async createLocation(entity) {
    try {
      const location = await this.repository.add(data);
      return location;
    } catch (err) {
      console.log("LocationService.createLocation", err);
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
