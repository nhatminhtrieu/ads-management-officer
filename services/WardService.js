import WardRepository from "../database/repositories/WardRepository.js";

export default class WardService {
  constructor() {
    this.repository = new WardRepository();
  }

  async addWard(data) {
    const existingDistrict = await this.repository.getDistrictById(
      data.district
    );
    if (!existingDistrict) {
      throw new Error("District not found");
    }
    const existingWard = await this.repository.getWardByName(
      data.ward,
      data.district
    );
    if (existingWard) {
      throw new Error("Ward already exists");
    }
    return await this.repository.addWard(data);
  }

  async getAllWards() {
    return await this.repository.getAllWards();
  }

  async getWardById(id) {
    return await this.repository.getWardById(id);
  }

  async getAllWardsByDistrict(id) {
    return await this.repository.getAllWardsByDistrict(id);
  }

  async findWardByEntity(entity) {
    return await this.repository.findWardByEntity(entity);
  }

  async updateWard(id, districtID, newName) {
    id = id.trim();
    districtID = districtID.trim();
    const district = await this.repository.getDistrictById(districtID);
    // if district not found
    if (!district) {
      throw new Error("District not found");
    }

    const ward = await this.repository.getWardById(id);

    // if ward not found
    if (!ward) {
      throw new Error("Ward not found");
    }

    return await this.repository.updateWard(id, districtID, newName);
  }

  async deleteWard(id, districtID) {
    id = id.trim();
    districtID = districtID.trim();
    const district = await this.repository.getDistrictById(districtID);

    // if district not found
    if (!district) {
      throw new Error("District not found");
    }

    const existingWard = await this.repository.getWardById(id);

    if (!existingWard) {
      throw new Error("Ward not found");
    }

    return await this.repository.deleteWard(id, districtID);
  }

  async findWardId(entity) {
    const ward = await this.findWardByEntity(entity);
    return ward._id;
  }
}