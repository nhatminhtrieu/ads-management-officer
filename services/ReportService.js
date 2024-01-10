import ReportRepository from "../database/repositories/ReportRepository.js";
import ReportTypeService from "./ReportTypeService.js";

export default class ReportService {
	constructor() {
		this.repository = new ReportRepository();
	}

	async createReport(data) {
		try {
			const report = await this.repository.createReport(data);
			return report.toObject();
		} catch (err) {
			console.log("ReportService.createReport", err);
		}
	}

	async getAllReports() {
		try {
			const reportTypeService = new ReportTypeService();
			let reports = await this.repository.getAllReports();
			reports = await Promise.all(reports.map(async (report) => {
				const reportType = (await reportTypeService.getReportTypeById(report.typeReport)).toObject();
				const newItem = {
					...report.toObject(),
					typeReportName: reportType.name,
				};
				return newItem;
			}));
			return reports;
		} catch (err) {
			console.log("ReportService.getAllReports", err);
		}
	}

	async find(entity) {
		const report = await this.repository.findByEntity(entity);
		return report;
	}

	async findReportById(id) {
		const report = await this.repository.findOne({ _id: id });
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

	async updateReport(id, data) {
		try {
			const report = await this.repository.update(id, data);
			return report;
		} catch (err) {
			console.log("ReportService.updateReport", err);
		}
	}
}
