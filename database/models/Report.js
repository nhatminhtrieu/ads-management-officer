import { Schema, model } from "mongoose";

const ReportSchema = new Schema(
	{
		id: {
			type: Schema.Types.ObjectId,
		},
		coordinate: {
			type: Object,
			required: true,
		},
		typeReport: {
			type: String,
			enum: ["Tố giác sai phạm", "Đăng ký nội dung", "Đóng góp ý kiến", "Giải đáp thắc mắc"],
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		imgs: [
			{
				type: String,
				required: true,
			},
		],
		resolvedContent: {
			type: String,
		},
		type: {
			type: String,
			enum: ["issued", "resolved"],
			default: "issue",
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

const Report = model("Report", ReportSchema, "reports");

export default Report;
