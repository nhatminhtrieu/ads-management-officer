import ReportRepository from "../database/repositories/ReportRepository.js";

export default class ReportService {
	constructor() {
		this.repository = new ReportRepository();
	}

	async createReport(data) {
		try {
			const report = await this.repository.createReport(data);
			return report;
		} catch (err) {
			console.log("ReportService.createReport", err);
		}
	}

	async getAllReports() {
		try {
			const reports = await this.repository.getAllReports();
			return reports;
		} catch (err) {
			console.log("ReportService.getAllReports", err);
		}
	}

	async findReportById(id) {
		const report = await this.repository.findByEntity({ _id: id });
		return report;
	}
}
