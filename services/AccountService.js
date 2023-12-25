import AccountRepository from "../database/repositories/AccountRepository.js"
import bcrypt from "bcrypt"

export default class AccountService {
    constructor() {
        this.repository = new AccountRepository()
    }

    async createAccount(account) {
        const salt = await bcrypt.genSalt(10)
        account.password = await bcrypt.hash(account.password, salt)
        await this.repository.add(account)
    }

    async verifyAccount(username, password) {
        const account = await this.repository.findByEntity({username})
        if (!account) {
            return null
        }
       
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) {
            return null
        }
        
        return account
    }

    async findByUsername(username) {
        return await this.repository.findByEntity({username})
    }

    async updatePassword(username, password) {
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
        await this.repository.patch(username, password)
    }
}