import DistrictRepository from "../database/repositories/DistrictRepository.js";

export default class DistrictService {
    constructor() {
        this.repository = new DistrictRepository();
    }

    async addDistrict(data) {
        const existingDistrict = await this.repository.getDistrictByName(data.name);
        if (existingDistrict) {
            throw new Error("District already exists");
        }
        console.log(data);
        return await this.repository.addDistrict(data);
    }

    async getAllDistricts() {
        return await this.repository.getAllDistricts();
    }

    async updateDistrict(name, data) {
        const existingDistrict = await this.repository.getDistrictByName(name);
        if (!existingDistrict) {
            throw new Error("District not found");
        }
        if (existingDistrict.name !== data.name) {
            throw new Error("District name cannot be changed");
        }
        return await this.repository.updateDistrict(name, data);
    }

    async deleteDistrict(name) {
        const existingDistrict = await this.repository.getDistrictByName(name);
        if (!existingDistrict) {
            throw new Error("District not found");
        }
        return await this.repository.deleteDistrict(name);
    }
}

