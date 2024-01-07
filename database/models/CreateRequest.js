import mongoose, { Schema } from "mongoose";

const CreateRequestSchema = new mongoose.Schema(
	{
		advertisement: {
			TypeBoard: {
				type: String,
				ref: "Advertisement",
				required: true,
			},
			number: {
				type: String,
				required: true,
			},
			size: {
				type: String,
				required: true,
			},
			imgs: [
				{
					type: String,
					required: true,
				},
			],
			start: {
				type: Date,
				required: true,
			},
			end: {
				type: Date,
				required: true,
			},
		},
		location: {
			type: Schema.Types.ObjectId,
			//   Sau khi tạo collection location cho điểm đặt quảng cáo
			ref: "Location",
			required: true,
		},
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

const CreateRequest = mongoose.model("CreateRequest", CreateRequestSchema, "createRequests");

export default CreateRequest;
