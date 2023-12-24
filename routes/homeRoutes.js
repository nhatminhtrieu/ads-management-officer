import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.render("vwHome/home");
});

export default router;
