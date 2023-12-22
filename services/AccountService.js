import AccountRepository from "../database/repositories/AccountRepository.js"
import bcrypt from "bcrypt"

export default class AccountService {
    constructor() {
        this.repository = new AccountRepository()
    }

    async verifyAccount(email, password) {
        const account = await this.repository.getByEmail(email)
        if (!account) {
            return null
        }
       
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) {
            return null
        }
        
        return account
    }
}