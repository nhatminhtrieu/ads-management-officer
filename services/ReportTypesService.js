import ReportTypesRepository from "../database/repositories/ReportTypesRepository.js"

export default class ReportTypesService {
    constructor() {
        this.repository = new ReportTypesRepository()
    }

    async addReportType(newType){
        const isExist = await this.repository.findByEntity(newType);

        if (isExist) {
            return {error: "Report type already exists"};
        }

        return await this.repository.add(newType);
    }

    async getAllReportTypes(){
        return await this.repository.getAll();
    }

    async deleteReportType(type){
        return await this.repository.delete(type);
    }

    async updateReportType({oldName, newName}){
        return await this.repository.update({oldName, newName});
    }
}