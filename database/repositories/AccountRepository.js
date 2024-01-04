import AccountModel from '../models/Account.js';

export default class AccountRepository {
    constructor() {
        this.model = AccountModel;
    }

    async add(entity) {
        const newEntity = new this.model(entity);
        return await newEntity.save();
    }

    async getAll() {
        return await this.model.find({status: {$ne: -1}});
    }

    async findByEntity(entity) {
        return await this.model.findOne(entity);
    }

    async patch(_id, password) {
        return await this.model.updateOne({ _id }, { password });
    }

    async patchEntity(entity, data) {
        return await this.model.updateOne(entity, data);
    }

    async patchLinkAccount(username, id) {
        return await this.model.updateOne({ username }, { $push: { account_link: id } });
    }
}