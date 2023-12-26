import { Schema, model } from "mongoose";
import District from "./District.js";

const WardSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        ward: {
            type: String,
            required: true,
        },
        district: {
            type: Schema.Types.ObjectId,
            ref: District,
            required: true,
        }
    },
    {
        versionKey: false,
    }
);

const Ward = model("Ward", WardSchema, "wards");