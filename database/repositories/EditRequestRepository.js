import EditRequest from "../models/EditRequest.js";

export default class EditRequestRepository {
  constructor() {
    this.model = EditRequest;
  }

  async add(entity) {
    const newEntity = new this.model(entity);
    return await newEntity.save();
  }

  async getAll() {
    return await this.model.find().lean();
  }

  async delete(entity) {
    return await this.model.deleteOne(entity);
  }

  async findAllByEntity(entity) {
    return await this.model.find(entity).lean();
  }

  async findByEntity(entity) {
    return await this.model
      .findOne(entity)
      .lean()
      .populate('rawLocation')
      .populate({ path: "location", populate: { path: "format" } });
  }

  async update(id, newEntity) {
    return await this.model.updateOne({ _id: id }, newEntity);
  }

  async findDataForPage({ offset, limit }) {
    const data = await this.model
      .find()
      .populate("rawLocation")
      .populate("rawAdvertisement")
      .skip(offset)
      .limit(limit);
    return data;
  }

  async countAll() {
    return await this.model.countDocuments();
  }
}
