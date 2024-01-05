import AccountRepository from "../database/repositories/AccountRepository.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export default class AccountService {
	constructor() {
		this.repository = new AccountRepository();
	}

	async createAccount(account) {
        const isExist = await this.repository.findByEntity({ username: account.username });
        if (isExist) {
            return false
        }

        switch (account.role) {
            case '1':
                account.district = new mongoose.mongo.ObjectId(account.district)
                account.ward = new mongoose.mongo.ObjectId(account.ward)
                break;
            case '2':
                account.district = new mongoose.mongo.ObjectId(account.district)
                account.ward = null
                break;
            case '3':
                account.ward = null
                account.district = null
                break;
            default:
                break;
        }

		const salt = await bcrypt.genSalt(10);
		account.password = await bcrypt.hash(account.password, salt);
    
		await this.repository.add(account);
        return true;
	}

    async verifyAccount(entity, password) {
        const account = await this.repository.findByEntity(entity)
        if (!account) {
            return null
        }
       
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) {
            return null
        }
        
        return account.toObject()
    }

	async createFirstAccount() {
		const isExist = await this.repository.findByEntity({ username: "admin" });

		if (!isExist) {
			const account = {
				username: "admin",
				fullname: "Đây là admin",
				email: "admin@gmail.com",
				password: await bcrypt.hash("12345678", await bcrypt.genSalt(10)),
				phone: "0123456789",
				dob: "1976-01-01",
			};

			await this.repository.add(account);
		}

        return !isExist;
    }

    async getAllAccount() {
        var data = await this.repository.getAll()
        if (!Array.isArray(data)) {
            data =  [data]
        }
        return data.map((item) => item.toObject()) 
    }

    async findById(_id) {
        return await this.repository.findByEntity({_id})
    }

	async findByUsername(username) {
		return await this.repository.findByEntity({ username, status: 1 });
	}

    async findByLinkAccount(id) {
        return await this.repository.findByEntity({account_link: {$in: [id]}})
    }
    
    async updatePassword(_id, password) {
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
        await this.repository.patch(_id, password)
    }

    async updateLinkAccount(username, id) {
        await this.repository.patchLinkAccount(username, id)
    }

    async updateProfile(_id, data) {
        await this.repository.patchEntity({_id}, data)
    }

    async updateStatus(_id, curStatus) {
        const status = curStatus == 1 ? 0 : 1
        await this.repository.patchEntity({_id}, {status});
    }

    async deleteAccount(_id) {  
        await this.repository.patchEntity({_id}, {status: -1})
    }
}
