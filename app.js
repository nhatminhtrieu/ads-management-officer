import express from "express";
import cors from "cors";
import Connection from "./database/Connection.js";
import AdvertisementRouter from "./routes/advertisementRoutes.js";
import VerifyCaptchaRouter from "./routes/verifyCaptchaRoutes.js";

const app = express();
const port = 3456;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is homepage");
});

app.use("/advertisement", AdvertisementRouter);

app.use("/static", express.static("static"));

app.use("/verify-captcha", VerifyCaptchaRouter);

app.listen(port, () => {
  console.log(`Example app listening on 127.0.0.1:${port}`);
});

Connection();
