import ReportModel from "../models/Report.js";

class ReportRepository {
	constructor() {
		this.model = ReportModel;
	}

	async createReport(data) {
		try {
			const report = new this.model(data);
			await report.save();
			return report;
		} catch (err) {
			console.log("createReport", err);
			throw err;
		}
	}

	async getAllReports() {
		try {
			return await this.model.find({})
		} catch (err) {
			console.log("getAllReports", err);
			throw err;
		}
	}

	async findByEntity(entity) {
		return await this.model.find(entity);
	}

	async findOne(entity){
		return await this.model.findOne(entity);
	}

	async findTotalPages(options) {
		try {
			const count = await this.model.countDocuments(options);
			return count;
		} catch (err) {
			console.log("findTotalPages", err);
			throw err;
		}
	}

	async findDataForPage({ offset, limit }, options) {
		try {
			const rawData = await this.model.find(options).skip(offset).limit(limit).lean();
			return rawData;
		} catch (err) {
			console.log("findDataForPage", err);
			throw err;
		}
	}

	async update(id, entity) {
		return await this.model.updateOne({ _id: id }, entity);
	}
}

export default ReportRepository;
