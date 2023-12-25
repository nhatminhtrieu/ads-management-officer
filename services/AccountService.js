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

    async verifyAccount(email, password) {
        const account = await this.repository.findByEntity({email})
        if (!account) {
            return null
        }
       
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) {
            return null
        }
        
        return account
    }

    async createFirstAccount() {
        const isExist = await this.repository.findByEntity({fullName: "admin"});

        if (!isExist) {
            const account = {
                fullName: "admin",
                email: "admin@gmail.com",
                password: await bcrypt.hash("12345678", await bcrypt.genSalt(10)),
                createdBy: "admin",
                createdAt: new Date(),
                phoneNumber: "0123456789",
                birthday: "1976-01-01",
                role: 3,
            }

            await this.repository.add(account);
        }

        return !isExist;
    }
}