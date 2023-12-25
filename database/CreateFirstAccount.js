import AccountService from "../services/AccountService.js";

export default async function CreateFirstAccount() {
  const service = new AccountService();
  const result = await service.createFirstAccount();

    if (result) {
        console.log("First account created");
    } else 
        console.log("First account existed");
}