import { Schema, model } from "mongoose";

const LocationSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  format: {
    type: Schema.Types.ObjectId,
    ref: "adsTypes",
    required: true,
  },
  zoning: {
    type: Boolean,
    required: true,
  },
  coordinate: {
    type: Object,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  area: {
    type: Object,
    required: true,
  },
}, {
  versionKey: false,
});

const Location = model("Location", LocationSchema, "locations");

export default Location;
