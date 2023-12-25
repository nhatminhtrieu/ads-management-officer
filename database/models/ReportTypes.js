import { Schema, model } from "mongoose";

const ReportTypeSchema = new Schema({
    name: String,
}, {
    versionKey: false,
});

const ReportTypes = model("ReportTypes", ReportTypeSchema, "ReportTypes");

export default ReportTypes;
