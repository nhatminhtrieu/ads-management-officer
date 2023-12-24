import BoardTypesRepository from "../database/repositories/BoardTypesRepository.js"

export default class BoardTypesService {
    constructor() {
        this.repository = new BoardTypesRepository()
    }

    async addBoardType(newType){
        const isExist = await this.repository.findByEntity(newType);

        if (isExist) {
            return {error: "Board type already exists"};
        }

        return await this.repository.add(newType);
    }

    async getAllBoardTypes(){
        return await this.repository.getAll();
    }

    async deleteBoardType(type){
        return await this.repository.delete(type);
    }
}