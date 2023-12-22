import AccountModel from '../models/Account.js';

export default class AccountRepository {
    constructor() {
        this.model = AccountModel;
    }

    async add(entity) {
        const newEntity = new this.model(entity);
        return await newEntity.save();
    }

    async findByEntity(entity) {
        return await this.model.findOne(entity);
    }
}