import moment from "moment";
import RequestRepository from "../database/repositories/RequestRepository.js";

export default class RequestService {
	constructor() {
		this.repository = new RequestRepository();
	}

	async createRequest(newReq) {
		const company = {
			name: newReq.comName,
			address: newReq.comAddress,
			email: newReq.comEmail,
			phone: newReq.comPhone,
		};
		const newRequest = {
			advertisement: newReq.advertisement,
			start: newReq.start,
			end: newReq.end,
			imgs: newReq.imgs,
			createdBy: newReq.createdBy,
			company,
		};
		const isExist = await this.repository.findByEntity(newReq);
		if (isExist) {
			return { error: "Request already exists" };
		}
		return await this.repository.add(newRequest);
	}

	async getAllRequests() {
		const list = await this.repository.getAll();
		return list;
	}

	async findTotalPages({ limit }, createdBy = {}) {
		try {
			const totalItems = await this.repository.countAll(createdBy);
			const totalPages = Math.ceil(totalItems / limit);
			return totalPages;
		} catch (err) {
			console.log("RequestService.findTotalPages", err);
		}
	}

	async findDataForPage({ offset, limit }, createdBy = {}) {
		try {
			const rawData = await this.repository.findDataForPage({ offset, limit }, createdBy);
			const data = rawData.map((item, index) => {
				const newItem = item;
				newItem["index"] = offset + index;
				return newItem;
			});
			return data;
		} catch (err) {
			console.log("RequestService.findDataForPage", err);
		}
	}

	async findById(_id) {
		let request = await this.repository.findByEntity({ _id });
		if (request) {
			request.advertisement.start = moment(request.advertisement.start).format("DD/MM/YYYY");
			request.advertisement.end = moment(request.advertisement.end).format("DD/MM/YYYY");
		}
		return request;
	}

	async deleteRequest(id) {
		return await this.repository.delete({ _id: id });
	}

	async approveRequest(id) {
		// Chờ service của location để tạo bảng quảng cáo mới
		return await this.repository.update(id, { accepted: "approved" });
	}

	async rejectRequest(id) {
		return await this.repository.update(id, { accepted: "rejected" });
	}
}
