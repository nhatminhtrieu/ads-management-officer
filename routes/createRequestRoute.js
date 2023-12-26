import express from "express";
const Router = express.Router();

Router.get("/", (req, res) => {
	res.render("vwAds/vwCreateRequests/list", { layout: "ads" });
});

Router.get("/new", (req, res) => {
	res.render("vwAds/vwCreateRequests/new", { layout: "ads" });
});

export default Router;
