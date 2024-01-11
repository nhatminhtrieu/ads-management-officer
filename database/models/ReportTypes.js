import { Schema, model } from "mongoose";

const ReportTypeSchema = new Schema({
    name: {
        type: String,
        enum: ["Tố giác sai phạm", "Đăng ký nội dung", "Đóng góp ý kiến", "Giải đáp thắc mắc"],
        required: true,
    },
}, {
    versionKey: false,
});

const ReportTypes = model("reportTypes", ReportTypeSchema, "reportTypes");

export default ReportTypes;