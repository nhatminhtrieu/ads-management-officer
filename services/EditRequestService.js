import moment from "moment";
import EditRequestRepository from "../database/repositories/EditRequestRepository.js";

export default class EditRequestService {
  constructor() {
    this.repository = new EditRequestRepository();
  }

  async createEditRequest(newReq) {
    await this.repository.add(newReq);
  }

  async getAllEditRequests() {
    const list = await this.repository.getAll();
    list.forEach((item) => {
      item["location"] = "Chờ service của location";
    });
    return list;
  }

  async findTotalPages({ limit }) {
    try {
      const totalItems = await this.repository.countAll();
      const totalPages = Math.ceil(totalItems / limit);
      return totalPages;
    } catch (err) {
      console.log("EditRequestService.findTotalPages", err);
    }
  }

  async findDataForPage({ offset, limit }) {
    try {
      const rawData = await this.repository.findDataForPage({ offset, limit });
      const data = rawData.map((item, index) => {
        const newItem = item;
        newItem["index"] = offset + index + 1;
        return newItem;
      });
      return data;
    } catch (err) {
      console.log("EditRequestService.findDataForPage", err);
    }
  }

  async findById(_id) {
    let request = await this.repository.findByEntity({ _id });
    if (request) {
      request.advertisement.start = moment(request.advertisement.start).format(
        "DD/MM/YYYY"
      );
      request.advertisement.end = moment(request.advertisement.end).format(
        "DD/MM/YYYY"
      );
    }
    return request;
  }

  async findRequestsByUser(user_id) {
    return await this.repository.findAllByEntity({ createdBy: user_id });
  }

  async deleteEditRequest(id) {
    return await this.repository.delete({ _id: id });
  }

  async approveEditRequest(id) {
    // Chờ service của location để tạo bảng quảng cáo mới
    return await this.repository.update(id, { accepted: "approved" });
  }

  async rejectEditRequest(id) {
    return await this.repository.update(id, { accepted: "rejected" });
  }
}
