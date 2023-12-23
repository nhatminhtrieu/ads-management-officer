import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.render("vwOfficers/officers");
});

export default router;
