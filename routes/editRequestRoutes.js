import express from "express";
import moment from "moment";

import LocationService from "../services/LocationService.js";
import EditRequestService from "../services/EditRequestService.js";
import AdsTypesService from "../services/AdsTypeService.js";

import { pagination } from "../utils/pagination.js";

const Router = express.Router();
const service = new EditRequestService();
const locationService = new LocationService();
const adsTypeService = new AdsTypesService();

// UI routers declaration
Router.get("/", async (req, res) => {
  const limit = 10;
  const result = await pagination(req, service, limit);

  res.render("vwAds/vwEditRequests/editRequests", {
    layout: "ads",
    empty: result.data.length == 0,
    list: result.data,
    totalPage: result.totalPage,
    page: result.page,
    pageNumbers: result.pageNumbers,
  });
});

Router.get("/create/location", async (req, res) => {
  const locations = await locationService.findAllLocations();
  const types = [
    "Đất công/Công viên/Hành lang an toàn giao thông",
    "Đất tư nhân/Nhà ở riêng lẻ",
    "Trung tâm thương mại",
    "Chợ",
    "Cây xăng",
    "Nhà chờ xe buýt",
  ];
  const adsTypes = await adsTypeService.findAllAdsType();

  res.render("vwAds/vwEditRequests/Location/create", {
    layout: "ads",
    locations,
    types,
    adsTypes,
  });
});

Router.post("/create/location", async (req, res) => {
  const data = req.body;
  const entity = {
    rawLocation: data.rawLocation,
    location: {
      type: data.type,
      format: data.format,
      zoning: false,
    },
    createAt: new Date(),
    createBy: res.locals.authUser._id,
    reason: data.reason,
    for: "location",
    accepted: "pending",
  };

  await service.createEditRequest(entity);

  res.redirect("/advertisement/edit-request");
});

Router.get("/create/advertisement", async (req, res) => {
  const locations = await locationService.findAllLocations();
  const list = [
    "Trụ bảng hiflex",
    "Trụ màn hình điện tử LED",
    "Trụ hộp đèn",
    "Bảng hiflex ốp tường",
    "Màn hình điện tử ốp tường",
    "Trụ treo băng rôn dọc",
    "Trụ treo băng rôn ngang",
    "Trụ/Cụm pano",
    "Cổng chào",
    "Trung tâm thương mại",
  ];

  res.render("vwAds/vwEditRequests/Advertisement/create", {
    layout: "ads",
    locations,
    list,
  });
});

Router.post("/create/advertisement", async (req, res) => {
  const data = req.body;
  const entity = {
    rawLocation: data.rawLocation,
    rawAdvertisement: data.rawAdvertisement,
    advertisement: {
      typeBoard: data.typeBoard,
      number: data.number,
      size: data.size,
      imgs: data.imgs,
      start: moment(data.start, "DD/MM/YYYY").format("YYYY-MM-DD"),
      end: moment(data.end, "DD/MM/YYYY").format("YYYY-MM-DD"),
    },
    createAt: new Date(),
    createBy: res.locals.authUser._id,
    reason: data.reason,
    for: "advertisement",
    accepted: "pending",
  };

  await service.createEditRequest(entity);

  res.redirect("/advertisement/edit-request");
});

// Router.get("/detail", async (req, res) => {
//   const id = req.query.id;
//   const request = await service.findById(id);
//   if (request === null) res.redirect("/advertisement/create-request");
//   else {
//     res.render("vwAds/vwCreateRequests/detail", { layout: "ads", request });
//   }
// });

// // Data routers declaration
// Router.post("/create", async (req, res) => {
//   await service.createRequest(req.body);
//   res.redirect("/advertisement/create-request");
// });

// Router.post("/delete", async (req, res) => {
//   await service.deleteCreateRequest(req.body.id);
//   res.redirect("/advertisement/create-request");
// });

// Router.post("/approve", async (req, res) => {
//   await service.approveCreateRequest(req.body.id);
//   res.redirect("/advertisement/create-request");
// });

// Router.post("/reject", async (req, res) => {
//   await service.rejectCreateRequest(req.body.id);
//   res.redirect("/advertisement/create-request");
// });

export default Router;
