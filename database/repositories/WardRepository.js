import WardModel from '../models/Ward.js'
import DistrictModel from '../models/District.js'


export default class WardRepository {
    constructor() {
        this.model = WardModel;
    }

    async addWard(data) {
        const ward = new this.model(data);
        return await ward.save();
    }

    async getAllWards() {
        return await this.model.find({ status: true }).populate('district', 'district');
    }

    async getAllWardsByDistrict(districtID) {
        return await this.model.find({ district: districtID, status: true }).populate('district', 'district');
    }

    async getDistrictById(id) {
        return await DistrictModel.findById(id);
    }

    async getWardByName(name, districtName) {
        const result = await this.model.findOne({ ward: name, district: districtName });
        return result;
    }

    async getWardById(id) {
        return await this.model.findById(id);
    }

    async updateWard(id, districtID, newName) {
        return await this.model.findOneAndUpdate({ _id: id, district: districtID }, { ward: newName }, { new: true });
    }

    async deleteWard(id, districtID) {
        return await this.model.findByIdAndUpdate({ _id: id }, { district: districtID, status: false }, { new: true });
    }
}