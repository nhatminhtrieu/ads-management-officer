import { Schema, model } from "mongoose";

const AdsTypesSchema = new Schema({
    name: String,
}, {
    versionKey: false,
});

const AdsTypes = model("AdsTypes", AdsTypesSchema, "AdsTypes");

export default AdsTypes;
