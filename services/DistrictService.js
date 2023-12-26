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

    async updateDistrict(id, newName) {
        id = id.trim();
        const district = await this.repository.getDistrictById(id);
        if (!district)
            throw new Error("District not found");
        if (district.name === newName) {
            throw new Error("District already exists");
        }
        console.log("Update successfully")
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
}

