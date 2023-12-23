import AdvertisementRouter from "../routes/advertisementRoutes.js";
import VerifyCaptchaRouter from "../routes/verifyCaptchaRoutes.js";
import HomeRouter from "../routes/homeRoutes.js";
import AccountRouter from "../routes/accountRoutes.js";
import OfficerRouter from "../routes/officerRoutes.js";
import ReportRouter from "../routes/reportRoutes.js";
import AreaRouter from "../routes/areaRoutes.js";

export default function (app, auth) {
	app.get("/", auth, (req, res) => {
		res.redirect("/home");
	});
	app.use("/home", HomeRouter);
	app.use("/advertisement", AdvertisementRouter);
	app.use("/verify-captcha", VerifyCaptchaRouter);
	app.use("/account", AccountRouter);
	app.use("/report", ReportRouter);
	app.use("/officer", OfficerRouter);
	app.use("/area", AreaRouter);
}
