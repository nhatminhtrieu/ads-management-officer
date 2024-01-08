import mongoose, { Schema } from "mongoose";

const EditRequestSchema = new mongoose.Schema(
  {
    rawLocation: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
    rawAdvertisement: {
      type: Schema.Types.ObjectId,
      ref: "Advertisement",
    },
    location: {
      type: {
        type: String,
      },
      format: {
        type: Schema.Types.ObjectId,
        ref: "adsTypes",
      },
    },
    advertisement: {
      typeBoard: {
        type: String,
      },
      number: {
        type: String,
      },
      size: {
        type: String,
      },
      imgs: [
        {
          type: String,
        },
      ],
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
    createAt: {
      type: Date,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
    reason: {
      type: String,
      require: true,
    },
    for: {
      type: String,
      enum: ["location", "advertisement"],
      require: true,
    },
    accepted: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      require: true,
    },
  },
  {
    versionKey: false,
  }
);

const EditRequest = mongoose.model(
  "EditRequest",
  EditRequestSchema,
  "editRequests"
);

export default EditRequest;
