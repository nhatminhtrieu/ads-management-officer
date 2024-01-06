import CreateRequest from "../models/CreateRequest.js";

export default class CreateRequestRepository {
	constructor() {
		this.model = CreateRequest;
	}

	async add(entity) {
		const newEntity = new this.model(entity);
		return await newEntity.save();
	}

	async getAll() {
		return await this.model.find().populate("location").lean();
	}

	async findAllByEntity(entity) {
		return await this.model.find(entity).populate("location").lean();
	}

	async findByEntity(entity) {
		return await this.model
			.findOne(entity)
			.populate("location")
			.populate({ path: "location", populate: "format" })
			.lean();
	}

	async findDataForPage({ offset, limit }) {
		const data = await this.model.find().populate("location").skip(offset).limit(limit);
		return data;
	}

	async countAll() {
		return await this.model.countDocuments();
	}

	async update(id, entity) {
		return await this.model.updateOne({ _id: id }, entity);
	}

	async delete(entity) {
		return await this.model.deleteOne(entity);
	}
}
