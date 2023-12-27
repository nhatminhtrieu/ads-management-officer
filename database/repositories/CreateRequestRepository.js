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
		return await this.model.find().lean();
	}

	async delete(entity) {
		return await this.model.deleteOne(entity);
	}

	async findAllByEntity(entity) {
		return await this.model.find(entity).lean();
	}

	async findByEntity(entity) {
		return await this.model.findOne(entity).lean();
	}

	async update(id, newEntity) {
		return await this.model.updateOne({ _id: id }, newEntity);
	}
}
