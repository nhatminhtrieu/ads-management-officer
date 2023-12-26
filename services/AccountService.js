import AccountRepository from "../database/repositories/AccountRepository.js";
import bcrypt from "bcrypt";

export default class AccountService {
	constructor() {
		this.repository = new AccountRepository();
	}

	async createAccount(account) {
		const salt = await bcrypt.genSalt(10);
		account.password = await bcrypt.hash(account.password, salt);
		await this.repository.add(account);
	}

	async verifyAccount(username, password) {
		const account = await this.repository.findByEntity({ username });
		if (!account) {
			return null;
		}

		const isMatch = await bcrypt.compare(password, account.password);
		if (!isMatch) {
			return null;
		}

		return account;
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

	async findByUsername(username) {
		return await this.repository.findByEntity({ username });
	}

	async updatePassword(username, password) {
		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);
		await this.repository.patch(username, password);
	}
}
