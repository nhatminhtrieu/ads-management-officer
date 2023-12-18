import { connect } from "mongoose";
import { config } from "dotenv";
import mongoose from "mongoose";
import Image from "./models/Image.js";
import Advertisement from "./models/Advertisement.js";

config();
export default async () => {
  const CONNECTION_STRING = process.env.CONNECTION_STRING;
  try {
    await connect(CONNECTION_STRING);
    console.log("Database connected");
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit(1);
  }
};
