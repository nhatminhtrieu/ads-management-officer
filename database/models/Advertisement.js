import { Schema, model } from "mongoose";

const AdvertisementSchema = new Schema(
  {
    typeBoard: {
      type: String,
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
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    used: {
      type: Schema.Types.ObjectId,
      ref: "Request",
    },
  },
  {
    versionKey: false,
  }
);

const Advertisement = model(
  "Advertisement",
  AdvertisementSchema,
  "advertisements"
);

export default Advertisement;
