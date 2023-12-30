import LocationModel from "../models/Location.js";
import generateLocation from "../utils/generateLocation.js";
import { mongoose } from "mongoose";

export default class LocationRepository {
  constructor() {
    this.model = LocationModel;
  }

  async add(entity) {
    const newEntity = new this.model(entity);
    return await newEntity.save();
  }

  async findDataForPage({ offset, limit }) {
    const data = await this.model
      .find()
      .populate("format")
      .skip(offset)
      .limit(limit);
    return data;
  }

  async countAll() {
    return await this.model.countDocuments();
  }

  async find(entity) {
    return await this.model.find(entity).populate("format");
  }

  async findAll() {
    return await this.model.find().populate("format");
  }

  async generate() {
    return await generateLocation();
  }
}
