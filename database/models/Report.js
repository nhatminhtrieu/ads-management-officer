import { Schema, model } from "mongoose";
import ReportTypes from "./ReportTypes.js";

const ReportSchema = new Schema(
	{
		coordinate: {
			type: Object,
			required: true,
		},
		typeReport: {
			type: Schema.Types.ObjectId,
			ref: ReportTypes,
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
			enum: ["Đã tiếp nhận", "Đã xử lý"],
			default: "issue",
			required: true,
		},
		createAt: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

const Report = model("Report", ReportSchema, "reports");

export default Report;
