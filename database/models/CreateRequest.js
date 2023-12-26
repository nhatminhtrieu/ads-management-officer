import mongoose, { Schema } from "mongoose";

const CreateRequestSchema = new mongoose.Schema(
	{
		advertisement: {
			type: Schema.Types.ObjectId,
			ref: "Advertisement",
			required: true,
		},
		location: {
			type: Schema.Types.ObjectId,
			//   Sau khi tạo collection location cho điểm đặt quảng cáo
			//   ref: "Location",
			required: true,
		},
		// Thông tin công ty
		name: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		startContract: {
			type: Date,
			required: true,
		},
		endContract: {
			type: Date,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "Account",
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

const CreateRequest = mongoose.model("CreateRequest", CreateRequestSchema, "CreateRequests");

export default CreateRequest;
