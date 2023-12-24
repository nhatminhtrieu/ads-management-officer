import BoardTypesModel from '../models/BoardTypes.js';

export default class BoardTypesRepository {
    constructor() {
        this.model = BoardTypesModel;
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
}