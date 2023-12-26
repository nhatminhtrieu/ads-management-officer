import auth from "./auth.js";
import AdvertisementRouter from "../routes/advertisementRoutes.js";
import VerifyCaptchaRouter from "../routes/verifyCaptchaRoutes.js";
import HomeRouter from "../routes/homeRoutes.js";
import AccountRouter from "../routes/accountRoutes.js";
import AdminRouter from "../routes/adminRoutes.js";
import ReportRouter from "../routes/reportRoutes.js";
import AdsTypeRouter from "../routes/adsTypeRoutes.js";
import ReportTypeRouter from "../routes/reportTypesRoutes.js";
import LocationRouter from "../routes/locationRoutes.js";

export default function (app) {
  app.get("/", auth, (req, res) => {
    res.redirect("/home");
  });
  app.use("/home", HomeRouter);
  app.use("/advertisement", AdvertisementRouter);
  app.use("/verify-captcha", VerifyCaptchaRouter);
  app.use("/account", AccountRouter);
  app.use("/report", ReportRouter);
  app.use("/admin", AdminRouter);
  app.use("/ads-type", AdsTypeRouter);
  app.use("/report-type", ReportTypeRouter);
  app.use("/location", LocationRouter);
}
