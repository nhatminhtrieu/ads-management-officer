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

	async findTotalPages() {
		const total = await this.repository.findTotalPages();
		return total;
	}

	async findDataForPage({ offset, limit }) {
		try {
			const rawData = await this.repository.findDataForPage({ offset, limit });
			const data = rawData.map((item, index) => {
				const newItem = {
					_id: item._id,
					coordinate: item.coordinate,
					typeReport: item.typeReport,
					email: item.email,
					name: item.name,
					phone: item.phone,
					content: item.content,
					imgs: item.imgs,
					resolvedContent: item.resolvedContent,
					type: item.type,
					createAt: item.createAt,
					index: offset + index + 1,
				};
				return newItem;
			});
			return data;
		} catch (err) {
			console.log("ReportService.findDataForPage", err);
		}
	}
}
