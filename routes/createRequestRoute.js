import express from "express";

import CreateRequestService from "../services/CreateRequestService.js";
import LocationService from "../services/LocationService.js";
import {
  authDepartmentRole,
  authNotDepartmentRole,
} from "../middleware/auth.js";
import { pagination } from "../utils/pagination.js";
import mongoose from "mongoose";

const Router = express.Router();
const service = new CreateRequestService();
const locationService = new LocationService();

// UI routers declaration
Router.get("/", async (req, res) => {
  const limit = 5;
  let empty = true;
  let options = {};
  if (req.session.authUser.role < 3) {
    options = { createdBy: req.session.authUser._id };
  }
  const result = await pagination(req, service, limit, options);
  if (result.data.length) empty = false;

  res.render("vwAds/vwCreateRequests/createRequests", {
    layout: "ads",
    empty,
    list: result.data,
    totalPage: result.totalPage,
    page: result.page,
    pageNumbers: result.pageNumbers,
  });
});

Router.get("/create", authNotDepartmentRole, async (req, res) => {
  const user = req.session.authUser;
  const option = {
    "area.district": new mongoose.Types.ObjectId(user.district),
  };
  if (user.role == "1")
    option["area.ward"] = new mongoose.Types.ObjectId(user.ward);

  const locations = await locationService.findAllLocations(option);
  res.render("vwAds/vwCreateRequests/create", { layout: "ads", locations });
});

Router.get("/detail", async (req, res) => {
  const id = req.query.id;
  const request = await service.findById(id);
  if (request === null) res.redirect("/advertisement/create-request");
  else {
    res.render("vwAds/vwCreateRequests/detail", { layout: "ads", request });
  }
});

// Data routers declaration
Router.post("/create", authNotDepartmentRole, async (req, res) => {
  const data = req.body;
  data.createdBy = req.session.authUser._id;
  await service.createRequest(data);
  res.redirect("/advertisement/create-request");
});

Router.post("/delete", async (req, res) => {
  await service.deleteCreateRequest(req.body.id);
  res.redirect("/advertisement/create-request");
});

Router.post("/approve", authDepartmentRole, async (req, res) => {
  await service.approveCreateRequest(req.body.id);
  res.redirect("/advertisement/create-request");
});

Router.post("/reject", authDepartmentRole, async (req, res) => {
  await service.rejectCreateRequest(req.body.id);
  res.redirect("/advertisement/create-request");
});

export default Router;
