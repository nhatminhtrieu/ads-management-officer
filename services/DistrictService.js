import DistrictRepository from "../database/repositories/DistrictRepository.js";

export default class DistrictService {
  constructor() {
    this.repository = new DistrictRepository();
  }

  async addDistrict(district) {
    const existingDistrict = await this.repository.getDistrictByName(
      district.district
    );
    if (existingDistrict) {
      throw new Error("District already exists");
    }
    return await this.repository.addDistrict(district);
  }

  async getAllDistricts() {
    return await this.repository.getAllDistricts();
  }

  async getDistrictById(id) {
    id = id.trim();
    return await this.repository.getDistrictById(id);
  }

  async findDistrictByName(district) {
    return await this.repository.getDistrictByName(district);
  }

  async updateDistrict(id, newName) {
    id = id.trim();
    const district = await this.repository.getDistrictById(id);
    if (!district) throw new Error("District not found");
    return await this.repository.updateDistrict(id, newName);
  }

  async deleteDistrict(id) {
    id = id.trim();
    const existingDistrict = await this.repository.getDistrictById(id);
    if (!existingDistrict) {
      throw new Error("District not found");
    }
    return await this.repository.deleteDistrict(id);
  }

  async findDistrictId(entity) {
    const district = await this.findDistrictByName(entity.district);
    return district._id;
  }
}
