import { Schema, model } from "mongoose";

const BoardTypeSchema = new Schema({
    name: String,
}, {
    versionKey: false,
});

const BoardTypes = model("BoardTypes", BoardTypeSchema, "BoardTypes");

export default BoardTypes;
