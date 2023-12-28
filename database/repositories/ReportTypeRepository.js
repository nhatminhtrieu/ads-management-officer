import ReportTypesModel from '../models/ReportTypes.js';

export default class ReportTypesRepository {
    constructor() {
        this.model = ReportTypesModel;
    }

    async add(entity) {
        const newEntity = new this.model(entity);
        return await newEntity.save();
    }

    async getAll(){
        return await this.model.find().sort({name: 1});
    }

    async delete(entity) {
        return await this.model.deleteOne(entity);
    }

    async findByEntity(entity) {
        return await this.model.findOne(entity);
    }

    async update({oldName, newName}) {
        return await this.model.updateOne({name: oldName}, {name: newName})
    }
}