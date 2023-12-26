import AdsTypes from "../models/AdsTypes.js";

export default class AdsTypesRepository {
  constructor() {
    this.model = AdsTypes;
  }

  async add(entity) {
    const newEntity = new this.model(entity);
    return await newEntity.save();
  }

  async findAll() {
    return await this.model.find().sort({ name: 1 });
  }

  async delete(entity) {
    return await this.model.deleteOne(entity);
  }

  async findByEntity(entity) {
    return await this.model.findOne(entity);
  }

  async update({ oldName, newName }) {
    return await this.model.updateOne({ name: oldName }, { name: newName });
  }

  async findById(id) {
    return await this.model.findById(id);
  }
}
