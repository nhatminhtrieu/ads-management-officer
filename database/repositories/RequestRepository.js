import Request from "../models/Request.js";

export default class RequestRepository {
	constructor() {
		this.model = Request;
	}

	async add(entity) {
		const newEntity = new this.model(entity);
		return await newEntity.save();
	}

	async findAllByEntity(entity) {
		return await this.model
			.find(entity)
			.populate("advertisement")
			.populate({ path: "advertisement", populate: "location" })
			.lean();
	}

	async findByEntity(entity) {
		return await this.model
			.findOne(entity)
			.populate("advertisement")
			.populate({ path: "advertisement", populate: "location" })
			.lean();
	}

	async findDataForPage({ offset, limit }, entity = {}) {
		const data = await this.model
			.find(entity)
			.populate("advertisement")
			.populate({ path: "advertisement", populate: "location" })
			.skip(offset)
			.limit(limit);
		return data;
	}

	async countAll(entity = {}) {
		return await this.model.countDocuments(entity);
	}

	async update(id, entity) {
		return await this.model.updateOne({ _id: id }, entity);
	}

	async delete(entity) {
		return await this.model.deleteOne(entity);
	}
}
