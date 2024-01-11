import express from "express";
import moment from "moment";
import nodemailer from "nodemailer";

import LocationService from "../services/LocationService.js";
import EditRequestService from "../services/EditRequestService.js";
import AdsTypesService from "../services/AdsTypeService.js";
import AdvertisementService from "../services/AdvertisementService.js";

import { pagination } from "../utils/pagination.js";
import {
  authDepartmentRole,
  authNotDepartmentRole,
} from "../middleware/auth.js";
import mongoose from "mongoose";

const Router = express.Router();
const service = new EditRequestService();
const locationService = new LocationService();
const adsTypeService = new AdsTypesService();
const advertisementService = new AdvertisementService();

// UI routers declaration
Router.get("/", async (req, res) => {
  const limit = 10;
  let options = {};
  if (req.session.authUser.role < 3) {
    options = { createdBy: req.session.authUser._id };
  }
  const result = await pagination(req, service, limit, options);

  res.render("vwAds/vwEditRequests/editRequests", {
    layout: "ads",
    empty: result.data.length == 0,
    list: result.data,
    totalPage: result.totalPage,
    page: result.page,
    pageNumbers: result.pageNumbers,
    message: req.session.message || "",
  });
});

Router.get("/create/location", authNotDepartmentRole, async (req, res) => {
  const { id } = req.query;
  const user = req.session.authUser;
  const option = {
    "area.district": new mongoose.Types.ObjectId(user.district),
  };
  if (user.role == "1")
    option["area.ward"] = new mongoose.Types.ObjectId(user.ward);

  const locations = id
    ? await locationService.find({ _id: new mongoose.Types.ObjectId(id) })
    : await locationService.findAllLocations(option);

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

Router.post("/create/location", authNotDepartmentRole, async (req, res) => {
  const data = req.body;
  const entity = {
    rawLocation: data.rawLocation,
    location: {
      type: data.type,
      format: data.format,
    },
    createdAt: new Date(),
    createdBy: req.session.authUser._id,
    reason: data.reason,
    for: "location",
    accepted: "pending",
  };

  await service.createEditRequest(entity);

  res.redirect("/advertisement/edit-request");
});

Router.get("/create/advertisement", authNotDepartmentRole, async (req, res) => {
  const { id } = req.query;
  const user = req.session.authUser;
  const option = {
    "area.district": new mongoose.Types.ObjectId(user.district),
  };
  if (user.role == "1")
    option["area.ward"] = new mongoose.Types.ObjectId(user.ward);

  let locations = [];
  let advertisement = {};
  if (id) {
    const list = await advertisementService.find({
      _id: new mongoose.Types.ObjectId(id),
    });
    advertisement = { ...list[0] };
    advertisement = advertisement._doc;
    delete advertisement._id;
    advertisement._id = id;
    locations.push(list[0].location);
  } else {
    locations = await locationService.findAllLocations(option);
  }

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
    advertisement,
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
    },
    createdAt: new Date(),
    createdBy: req.session.authUser._id,
    reason: data.reason,
    for: "advertisement",
    accepted: "pending",
  };

  await service.createEditRequest(entity);

  res.redirect("/advertisement/edit-request");
});

Router.get("/detail", async (req, res) => {
  const id = req.query.id;
  const request = await service.findById(id);
  if (request === null) res.redirect("/advertisement/edit-request");
  else {
    res.render("vwAds/vwEditRequests/detail", {
      layout: "ads",
      request,
      location: request.rawLocation,
    });
  }
});

// Data routers declaration

Router.post("/delete", async (req, res) => {
  await service.deleteEditRequest(req.body.id);
  res.redirect("/advertisement/edit-request");
});

function sendEmail(email, request, accepted) {
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "bddquan@gmail.com",
      pass: "wjge iflg rmzs nghh",
    },
  });
  var mainOptions = {
    from: "JCXDC Team",
    to: email,
    subject: "Cập nhật tình trạng xét duyệt yêu cầu chỉnh sửa",
    text: "Bạn nhận được tin nhắn này từ đội ngũ phát triển website - JCXDC team ",
    html: `<div style="border-bottom:1px solid #eee"> \
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">JCXDC team</a> \
        </div> \
        <p style="font-size:1.1em">Xin chào,</p> \
        <p>Yêu cầu chỉnh sửa về ${
          request.for == "location" ? "điểm quảng cáo" : "bảng quảng cáo"
        } tại <b>${request.rawLocation.address}</b> của bạn vừa ${
      accepted ? "được" : "bị"
    }</p>\
        <h2 style="background: #00466a;margin: auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${
          accepted ? "Chấp nhận" : "Từ chối"
        }</h2> \
        <p style="font-size:0.9em;">Trân trọng,<br />JCXDC team</p> \
        <hr style="border:none;border-top:1px solid #eee" /> \
        <div style="float:right;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"> \
            <p>JCXDC team</p> \
            <p>HCM City</p> \
        </div>`,
  };
  transporter.sendMail(mainOptions, (err, info) => {
    if (err) console.log(err);
  });
}

Router.post("/approve", authDepartmentRole, async (req, res) => {
  const request = await service.findById(req.body.id);
  if (request.createdBy.email)
    sendEmail(request.createdBy.email, request, true);
  else req.session.message = "Cán bộ tạo yêu cầu chỉnh sửa không có email";

  if (request.for == "location") {
    await locationService.updateLocation(request.rawLocation, request.location);
  } else {
    await advertisementService.updateAdvertisement(
      request.rawAdvertisement,
      request.advertisement
    );
  }

  await service.approveEditRequest(req.body.id);
  res.redirect("/advertisement/edit-request");
});

Router.post("/reject", authDepartmentRole, async (req, res) => {
  const request = await service.findById(req.body.id);
  if (request.createdBy.email)
    sendEmail(request.createdBy.email, request, false);
  else req.session.message = "Cán bộ tạo yêu cầu chỉnh sửa không có email";

  await service.rejectEditRequest(req.body.id);
  res.redirect("/advertisement/edit-request");
});

export default Router;
