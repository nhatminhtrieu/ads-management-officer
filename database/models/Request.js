import mongoose, { Schema } from "mongoose";

const RequestSchema = new mongoose.Schema(
	{
		advertisement: {
			type: Schema.Types.ObjectId,
			ref: "Advertisement",
			required: true,
		},
		start: {
			type: Date,
			required: true,
		},
		end: {
			type: Date,
			required: true,
		},
		imgs: [
			{
				type: String,
				required: true,
			},
		],
		// Thông tin công ty
		company: {
			name: {
				type: String,
				required: true,
			},
			address: {
				type: String,
				required: false,
			},
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "Account",
			required: true,
		},
		accepted: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

const Request = mongoose.model("Request", RequestSchema, "requests");

export default Request;
