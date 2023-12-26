import Ward from '../models/Ward.js'

export default class WardRepository {
    constructor() {
        this.model = Ward;
    }

    async addWard(data) {
        try {
            const ward = new this.model(data);
            await ward.save();
            return ward;
        } catch (err) {
            console.err("addWard", err);
            throw err;
        }
    }

    async getAllWards() {
        try {
            return await this.model.find({});
        } catch (err) {
            console.err("getAllWards", err);
            throw err;
        }
    }

    async getWardByName(name) {
        try {
            return await this.model.findOne({ name });
        } catch (err) {
            console.err("getWardByName", err);
            throw err;
        }
    }

    async updateWard(name, data) {
        try {
            const updatedWard = await Ward.findOneAndUpdate({ name: name }, data, { new: true });
            if (!updatedWard) {
                throw new Error("Ward not found");
            }

            if (updatedWard.name !== data.name) {
                throw new Error("Ward name cannot be changed");
            }

            if (updatedWard.districts === data.districts) {
                throw new Error("Districts cannot be changed");
            }

            return updatedWard;
        } catch (err) {
            throw err;
        }
    }

    async deleteWard(name) {
        try {
            const deletedWard = await Ward.findOneAndDelete({ name: name });
            if (!deletedWard) {
                throw new Error("Ward not found");
            }

            return deletedWard;
        } catch (err) {
            throw err;
        }
    }
}