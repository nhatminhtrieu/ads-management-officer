import LocationModel from "../models/Location.js";
import generateLocation from "../utils/generateLocation.js";

export default class LocationRepository {
  constructor() {
    this.model = LocationModel;
  }

  async add(entity) {
    const newEntity = new this.model(entity);
    return await newEntity.save();
  }

  async generate() {
    return await generateLocation();
  }
}
