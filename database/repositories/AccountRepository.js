import AccountModel from '../models/Account.js';

export default class AccountRepository {
    constructor() {
        this.model = AccountModel;
    }

    async add(entity) {
        const newEntity = new this.model(entity);
        return await newEntity.save();
    }

    async getByEmail(email) {
        return await this.model.findOne({ email: email });
    }
}