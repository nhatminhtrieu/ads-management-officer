import { Schema, model } from "mongoose";

const AdvertisementSchema = new Schema({
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
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
});

const Advertisement = model(
  "Advertisement",
  AdvertisementSchema,
  "advertisements"
);

export default Advertisement;
