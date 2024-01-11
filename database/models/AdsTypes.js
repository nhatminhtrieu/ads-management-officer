import { Schema, model } from "mongoose";

const AdsTypesSchema = new Schema({
    name: String,
}, {
    versionKey: false,
});

const AdsTypes = model("adsTypes", AdsTypesSchema, "adsTypes");

export default AdsTypes;
