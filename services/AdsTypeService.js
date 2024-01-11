import AdsTypeRepository from "../database/repositories/AdsTypeRepository.js";

export default class AdsTypesService {
  constructor() {
    this.repository = new AdsTypeRepository();
  }

  async addAdsType(newType) {
    const isExist = await this.repository.findByEntity(newType);

    if (isExist) {
      return { error: "Ads type already exists" };
    }

    return await this.repository.add(newType);
  }

  async findAllAdsType() {
    return await this.repository.findAll();
  }

  async deleteAdsType(type) {
    return await this.repository.delete(type);
  }

  async updateAdsType({ oldName, newName }) {
    return await this.repository.update({ oldName, newName });
  }

  async findAdsTypeById(id) {
    return await this.repository.findById(id);
  }
}
