import DistrictModel from '../models/District.js'

export default class DistrictRepository {
    constructor() {
        this.model = DistrictModel;
    }

    async addDistrict(data) {
        const district = new this.model(data);
        return await district.save();
    }

    async getAllDistricts() {
        return await this.model.find();
    }

    async getDistrictByName(name) {
        return await this.model.findOne({ district: name });
    }

    async getDistrictById(id) {
        return await this.model.findById(id);
    }

    async updateDistrict(id, newName) {
        return await this.model.findOneAndUpdate({ _id: id }, { district: newName }, { new: true });
    }

    async deleteDistrict(id) {
        return await this.model.findByIdAndUpdate({ _id: id }, { status: false }, { new: true });
    }
}