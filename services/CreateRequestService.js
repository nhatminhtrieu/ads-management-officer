import CreateRequestRepository from "../database/repositories/CreateRequestRepository.js";

export default class CreateRequestService {
	constructor() {
		this.repository = new CreateRequestRepository();
	}

	async addCreateRequest(newReq) {
		const isExist = await this.repository.findByEntity(newReq);
		if (isExist) {
			return { error: "Request already exists" };
		}

		const advertisement = {
			TypeBoard: newReq.typeBoard,
			size: newReq.size,
			number: newReq.number,
			imgs: newReq.imgs,
			start: newReq.startContract,
			end: newReq.endContract,
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
			company,
		};
		await this.repository.add(newRequest);
	}

	async getAllCreateRequests() {
		const list = await this.repository.getAll();
		list.forEach((item) => {
			item["location"] = "Chờ service của location";
		});
		return list;
	}

	async findRequestsByUser(user_id) {
		return await this.repository.findAllByEntity({ createdBy: user_id });
	}

	async deleteCreateRequest(id) {
		return await this.repository.delete({ _id: id });
	}

	async acceptCreateRequest(id) {
		return await this.repository.update(id, { accepted: true });
	}
}
