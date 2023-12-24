import AdsTypesRepository from "../database/repositories/AdsTypesRepository.js"

export default class BoardTypesService {
    constructor() {
        this.repository = new AdsTypesRepository()
    }

    async addAdsType(newType){
        const isExist = await this.repository.findByEntity(newType);

        if (isExist) {
            return {error: "Ads type already exists"};
        }

        return await this.repository.add(newType);
    }

    async getAllAdsTypes(){
        return await this.repository.getAll();
    }

    async deleteAdsType(type){
        return await this.repository.delete(type);
    }
}