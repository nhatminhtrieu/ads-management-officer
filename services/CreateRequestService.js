import moment from "moment";
import CreateRequestRepository from "../database/repositories/CreateRequestRepository.js";

export default class CreateRequestService {
	constructor() {
		this.repository = new CreateRequestRepository();
	}

	async createRequest(newReq) {
		const advertisement = {
			TypeBoard: newReq.typeBoard,
			size: newReq.size,
			number: newReq.number,
			imgs: newReq.imgs,
			start: moment(newReq.start, "DD/MM/YYYY").format("YYYY-MM-DD"),
			end: moment(newReq.end, "DD/MM/YYYY").format("YYYY-MM-DD"),
		};
		const company = {
			name: newReq.comName,
			address: newReq.comAddress,
			email: newReq.comEmail,
			phone: newReq.comPhone,
		};
		const newRequest = {
			advertisement,
			location: newReq.location,
			createdBy: newReq.createdBy,
			company,
		};
		const isExist = await this.repository.findByEntity(newReq);
		if (isExist) {
			return { error: "Request already exists" };
		}
		return await this.repository.add(newRequest);
	}

	async getAllCreateRequests() {
		const list = await this.repository.getAll();
		return list;
	}

	async findTotalPages({ limit }, createdBy = {}) {
		try {
			const totalItems = await this.repository.countAll(createdBy);
			const totalPages = Math.ceil(totalItems / limit);
			return totalPages;
		} catch (err) {
			console.log("CreateRequestService.findTotalPages", err);
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
			console.log("CreateRequestService.findDataForPage", err);
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

	async deleteCreateRequest(id) {
		return await this.repository.delete({ _id: id });
	}

	async approveCreateRequest(id) {
		// Chờ service của location để tạo bảng quảng cáo mới
		return await this.repository.update(id, { accepted: "approved" });
	}

	async rejectCreateRequest(id) {
		return await this.repository.update(id, { accepted: "rejected" });
	}
}