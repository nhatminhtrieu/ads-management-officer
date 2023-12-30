import { Schema, model } from "mongoose";

const DistrictSchema = new Schema(
    {
        district: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        }
    },
    {
        versionKey: false,
    }
);

const District = model("District", DistrictSchema, "districts");

export default District;