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

  async findDataForPage({ offset, limit }, options = {}) {
    const data = await this.model
      .find(options)
      .populate("format")
      .skip(offset)
      .limit(limit);
    return data;
  }

  async countAll(options = {}) {
    return await this.model.countDocuments(options);
  }

  async find(entity) {
    return await this.model.find(entity).populate("format");
  }

  async findAll(entity={}) {
    return await this.model.find(entity).populate("format");
  }

  async generate() {
    return await generateLocation();
  }

  async update(id, entity) {
    return await this.model.updateOne({ _id: id }, entity);
  }

  async delete(id) {
    return await this.model.deleteOne({ _id: id });
  }
}
