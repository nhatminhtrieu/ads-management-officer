import { connect } from "mongoose";
import { config } from "dotenv";

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
