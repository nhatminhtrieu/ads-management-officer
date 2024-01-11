import express, { response } from "express";
const router = express.Router();
import ReportTypeService from "../services/ReportTypeService.js";
import ReportService from "../services/ReportService.js";
import DistrictService from "../services/DistrictService.js";
import WardService from "../services/WardService.js";
import { pagination } from "../utils/pagination.js";
import moment from "moment";
import nodemailer from "nodemailer";
import mongoose, { Types } from "mongoose";

const apiKey = process.env.GOOGLE_API_KEY;
const reportService = new ReportService();
const reportTypeService = new ReportTypeService();
const districtService = new DistrictService();
const wardService = new WardService();
import { authDepartmentRole, authNotDepartmentRole } from "../middleware/auth.js";

// UI routers declaration
router.get("/", async (req, res) => {
	const limit = parseInt(req.query.limit) || 10;
	var options = {};

	switch (req.session.authUser.role) {
		case 1:
			options =
			{
				"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
				"area.ward": new mongoose.Types.ObjectId(req.session.authUser.ward),
			};
			break;
		case 2:
			let fav_list = []
			if (req.session.authUser.fav_list.length === 0) {
				options =
				{
					"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
				};
			} else {
				for (const item of req.session.authUser.fav_list) {
					fav_list.push(new mongoose.Types.ObjectId(item))
					options
				}
				options =
				{
					"area.district": new mongoose.Types.ObjectId(req.session.authUser.district),
					"area.ward": { $in: fav_list },
				}
			}
			break;
		default:
			options = {}
			break;
	}

	const paginatedReports = await pagination(req, reportService, limit, options);

	for (let report of paginatedReports.data) {
		// Populate the typeReport field
		report.typeReport = await reportTypeService.getReportTypeById(report.typeReport);

		const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${report.coordinate.lat},${report.coordinate.lng}&key=${apiKey}`);
		const data = await response.json();
		if (data.results[0]) {
			report.address = data.results[0].formatted_address;
		}
	}

	res.render("vwReports/reports", {
		layout: "report",
		reports: paginatedReports.data,
		pageNumbers: paginatedReports.pageNumbers,
		prev_value: paginatedReports.page - 1,
		next_value: paginatedReports.page + 1,
		prev_disabled: paginatedReports.page === 1,
		next_disabled: paginatedReports.page === paginatedReports.totalPage,
	});

});

router.get('/manage/:id', async (req, res) => {
	const id = req.params.id;
	var report = await reportService.findReportById(id);
	const reportTypes = await reportTypeService.getAllReportTypes();
	report.typeReport = await reportTypeService.getReportTypeById(report.typeReport);
	report.typeReportName = "report.typeReport.name"
	const statusReports = ['Chưa xử lý', 'Đã xử lý'];

	const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${report.coordinate.lat},${report.coordinate.lng}&key=${apiKey}`);
	const data = await response.json();
	if (data.results[0]) {
		report.address = data.results[0].formatted_address;
	}

	res.render('vwReports/detail', {
		layout: 'report',
		report,
		reportTypes,
		statusReports,
		isSelected: report.typeReport._id,
		formatDays: {
			createDate: moment(report.createAt).format('DD/MM/YYYY'),
		},
	});
});

router.post('/manage/:id', authNotDepartmentRole, async (req, res) => {
	const id = req.params.id;
	const { typeReport, statusReport, resolvedContent } = req.body;

	var report = await reportService.findReportById(id);

	if (typeReport) {
		report.typeReport = await reportTypeService.getReportTypeById(typeReport);
	}

	if (statusReport) {
		report.type = statusReport;
	}

	if (resolvedContent) {
		report.resolvedContent = resolvedContent;
	}

	await reportService.updateReport(id, report);

	var transporter = nodemailer.createTransport({ // config mail server
		service: 'Gmail',
		auth: {
			user: 'bddquan@gmail.com',
			pass: 'wjge iflg rmzs nghh'
		}
	});
	var mainOptions = {
		from: 'JCXDC Team',
		to: report.email,
		subject: 'Cập nhật báo cáo',
		text: 'Bạn nhận được tin nhắn này từ đội ngũ phát triển website - JCXDC team ',
		html:
			'<div style="border-bottom:1px solid #eee"> \
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">JCXDC team</a> \
            </div> \
            <p style="font-size:1.1em">Xin chào,</p> \
            <p>Báo cáo của bạn đã thay đổi sang tình trạng</p> \
            <h2 style="background: #00466a;margin: auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">'
			+
			report.resolvedContent + '</h2> \
            <p style="font-size:0.9em;">Trân trọng,<br />JCXDC team</p> \
            <hr style="border:none;border-top:1px solid #eee" /> \
            <div style="float:right;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"> \
                <p>JCXDC team</p> \
                <p>HCM City</p> \
            </div>'
	}
	transporter.sendMail(mainOptions, (err, info) => {
		if (err) console.log(err);
		else {
			res.redirect(`/report/manage/${id}`);
		}
	})
});

router.get("/type-report", authDepartmentRole, async (req, res) => {
	const list = await reportTypeService.getAllReportTypes();
	res.render("vwReports/typeReport", {
		layout: "report",
		list,
	});
});

router.get("/statistic", authDepartmentRole, async (req, res) => {
	const listDistricts = await districtService.getAllDistricts();
	const listReports = await reportService.getAllReports();

	const reportsByDistrict = [];

	for (let district of listDistricts) {
		const listReportsByDistrict = [];

		const reports = listReports.filter((report) => {
			if (!report.area || !report.area.district) {
				console.error('Report does not have a district:', report);
				return false;
			}

			if (!district || !district._id) {
				console.error('District does not have an _id:', district);
				return false;
			}

			return report.area.district.toString() === district._id.toString();
		});

		const countByType = [];
		const countByStatus = [];

		for (const report of reports) {
			const typeReportName = await reportTypeService.getReportTypeById(report.typeReport);

			const typeReportIndex = countByType.findIndex((type) => {
				return type.name === typeReportName.name;
			});

			if (typeReportIndex === -1) {
				countByType.push({
					name: typeReportName.name,
					count: 1,
				});
			} else {
				countByType[typeReportIndex].count++;
			}

			const statusReportIndex = countByStatus.findIndex((status) => {
				return status.name === report.type;
			});

			if (statusReportIndex === -1) {
				countByStatus.push({
					name: report.type,
					count: 1,
				});
			} else {
				countByStatus[statusReportIndex].count++;
			}
		}

		const listWards = await wardService.getAllWardsByDistrict(district._id);

		for (const ward of listWards) {
			const reports = listReports.filter((report) => {
				return report.area.ward.toString() === ward._id.toString();
			});

			const countByType = [];
			const countByStatus = [];
			for (const report of reports) {
				const typeReportName = await reportTypeService.getReportTypeById(report.typeReport);

				const typeReportIndex = countByType.findIndex((type) => {
					return type.name === typeReportName.name;
				});

				if (typeReportIndex === -1) {
					countByType.push({
						name: typeReportName.name,
						count: 1,
					});
				} else {
					countByType[typeReportIndex].count++;
				}

				const statusReportIndex = countByStatus.findIndex((status) => {
					return status.name === report.type;
				});

				if (statusReportIndex === -1) {
					countByStatus.push({
						name: report.type,
						count: 1,
					});
				} else {
					countByStatus[statusReportIndex].count++;
				}
			}

			listReportsByDistrict.push({
				district: district.district,
				ward: ward.ward,
				count: reports.length,
				countByType: countByType,
				countByStatus: countByStatus,
			});
		}

		reportsByDistrict.push({
			district: district.district,
			listReportsByDistrict: listReportsByDistrict,
		});

		// Sort the listReportsByDistrict array
		listReportsByDistrict.sort((a, b) => {
			if (a.count === 0 && b.count === 0) {
				return 0;
			} else if (a.count === 0) {
				return 1;
			} else if (b.count === 0) {
				return -1;
			} else {
				return b.count - a.count;
			}
		});
	}

	res.render("vwReports/statistic", {
		layout: "report",
		reportsByDistrict,
	});
});

// Data routers declaration
router.get("/all", async (req, res) => {
	const list = await reportService.getAllReports();
	res.send(list);
});

export default router;