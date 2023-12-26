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
        return await this.model.findOne({ name });
    }

    async updateDistrict(name, data) {
        return await this.model.findOneAndUpdate({ name }, data, { new: true });
    }

    async deleteDistrict(name) {
        return await this.model.findOneAndDelete({ name });
    }
}