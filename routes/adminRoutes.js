import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.redirect("/officers");
});

router.get("/officer", (req, res) => {
	res.render("vwAdmin/officers", { layout: "admin" });
});

router.get("/area", (req, res) => {
	res.render("vwAdmin/areas", { layout: "admin" });
});

export default router;
