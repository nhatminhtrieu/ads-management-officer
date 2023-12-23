import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.render("vwAreas/areas");
});

export default router;
