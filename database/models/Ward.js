import { Schema, model } from "mongoose";
import District from "./District.js";

const WardSchema = new Schema(
    {
        ward: {
            type: String,
            required: true,
        },
        district: {
            type: Schema.Types.ObjectId,
            ref: District,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        versionKey: false,
    }
);

const Ward = model("Ward", WardSchema, "wards");

export default Ward;