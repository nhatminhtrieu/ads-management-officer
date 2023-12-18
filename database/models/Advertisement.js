import { Schema, model } from "mongoose";

const AdvertisementSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  address: {
    address_components: [
      {
        type: Object,
      },
    ],
    formatted_text: {
      type: String,
      required: true,
    },
  },
  coordinate: {
    type: Object,
    required: true,
  },
  typeLoc: {
    type: String,
    required: true,
  },
  typeAds: {
    type: String,
    required: true,
  },
  typeBoard: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  zoning: {
    type: Boolean,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  imgs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
  ],
  exp: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "pending", "active", "expired", "suspended"],
    required: true,
  },
});

const Advertisement = model(
  "Advertisement",
  AdvertisementSchema,
  "advertisements"
);

export default Advertisement;