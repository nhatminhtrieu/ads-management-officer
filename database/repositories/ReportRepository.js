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
			return await this.model.find({});
		} catch (err) {
			console.log("getAllReports", err);
			throw err;
		}
	}

	async findByEntity(entity) {
		return await this.model.findOne(entity).lean();
	}

	async findTotalPages() {
		const total = await this.model.countDocuments();
		return total;
	}

	async findDataForPage({ offset, limit }) {
		try {
			const rawData = await this.model.find({}).skip(offset).limit(limit).lean();
			return rawData;
		} catch (err) {
			console.log("findDataForPage", err);
			throw err;
		}
	}
}

export default ReportRepository;
