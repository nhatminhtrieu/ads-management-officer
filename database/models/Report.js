import { Schema, model } from "mongoose";
import Image from "models/Image";

const ReportSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      enum: ["example1@example.com", "example2@example.com"], // Add your desired email options here
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imgs: {
      type: [Image],
      required: true,
    },
    type: {
      type: String,
      enum: ["issued", "resolved"],
      default: "issue",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Report = model("Report", ReportSchema, "reports");

export default Report;
