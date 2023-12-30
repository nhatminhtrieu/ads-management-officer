import { Schema, model } from "mongoose";

const ReportTypeSchema = new Schema({
    name: String,
}, {
    versionKey: false,
});

const ReportTypes = model("reportTypes", ReportTypeSchema, "reportTypes");

export default ReportTypes;
