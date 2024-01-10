// Define your routes here
import express, { raw } from "express";
const router = express.Router();
import AdvertisementService from "../services/AdvertisementService.js";
import AdsTypesService from "../services/AdsTypeService.js";
import LocationService from "../services/LocationService.js";
import WardService from "../services/WardService.js";
import DistrictService from "../services/DistrictService.js";
import requestRouter from "./requestRoute.js";
import editRequestRouter from "./editRequestRoutes.js";
import moment from "moment";
import mongoose from "mongoose";
import { pagination } from "../utils/pagination.js";
import { authDepartmentRole } from "../middleware/auth.js";

// UI routers declaration
router.get("/manage", async (req, res) => {
  const service = new AdvertisementService();
  const limit = 20;

  let result = [];

  // Role: Department Officer
  if (req.session.authUser.role === 3)
    result = await pagination(req, service, limit);
  // Role: District Officer
  else if (req.session.authUser.role === 2) {
    // Fav_list == [] -> all
    if (req.session.authUser.fav_list.length === 0)
      result = await pagination(req, service, limit, {
        "area.district": new mongoose.Types.ObjectId(
          req.session.authUser.district
        ),
      });
    else {
      let fav_list_ids = [];
      req.session.authUser.fav_list.forEach((id) => {
        fav_list_ids.push(new mongoose.Types.ObjectId(id));
      });

      result = await pagination(req, service, limit, {
        "area.district": new mongoose.Types.ObjectId(
          req.session.authUser.district
        ),
        "area.ward": { $in: fav_list_ids },
      });
    }
  }
  // Role: Ward Officer
  else if (req.session.authUser.role === 1) {
    result = await pagination(req, service, limit, {
      area: {
        district: new mongoose.Types.ObjectId(req.session.authUser.district),
        ward: new mongoose.Types.ObjectId(req.session.authUser.ward),
      },
    });
  }

  res.render("vwAds/ads", {
    layout: "ads",
    list: result.data,
    totalPage: result.totalPage,
    page: result.page,
    pageNumbers: result.pageNumbers,
  });
});

router.get("/manage/new", authDepartmentRole, async (req, res) => {
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
  const locationService = new LocationService();
  const locations = await locationService.findAllLocations();

  res.render("vwAds/create", {
    layout: "ads",
    list,
    locations,
  });
});

router.post("/manage/new", async (req, res) => {
  const data = req.body;

  const entity = {
    typeBoard: data.typeBoard,
    number: data.number,
    size: data.size,
    imgs: data.imgs,
    location: new mongoose.Types.ObjectId(data.location),
  };

  const service = new AdvertisementService();
  await service.createAdvertisement(entity);

  res.redirect("/advertisement/manage");
});

router.get("/manage/:id", async (req, res) => {
  const service = new AdvertisementService();
  let ad = await service.find({ _id: req.params.id });
  ad = ad[0];

  const rawTypeBoards = [
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
  const typeBoards = rawTypeBoards.map((typeBoard) => {
    return {
      name: typeBoard,
      isSelected: typeBoard === ad.typeBoard,
    };
  });

  res.render("vwAds/detail", {
    layout: "ads",
    ad,
    location: ad.location,
    typeBoards,
  });
});

router.post("/manage/:id", async (req, res) => {
  const data = req.body;

  const entity = {
    typeBoard: data.typeBoard,
    number: data.number,
    size: data.size,
    imgs: data.imgs,
  };

  const service = new AdvertisementService();
  const result = await service.updateAdvertisement(req.params.id, entity);

  res.redirect(`/advertisement/manage/${req.params.id}`);
});

router.post("/manage/delete/:id", async (req, res) => {
  const id = req.params.id;
  const service = new AdvertisementService();
  const result = await service.deleteAdvertisement(id);
  res.redirect("/advertisement/manage");
});

router.get("/ad-location", async (req, res) => {
  const service = new LocationService();
  const limit = 20;

  let result = [];

  // Role: Department Officer
  if (req.session.authUser.role === 3)
    result = await pagination(req, service, limit);
  // Role: District Officer
  else if (req.session.authUser.role === 2) {
    // Fav_list == [] -> all
    if (req.session.authUser.fav_list.length === 0)
      result = await pagination(req, service, limit, {
        "area.district": new mongoose.Types.ObjectId(
          req.session.authUser.district
        ),
      });
    else {
      let fav_list_ids = [];
      req.session.authUser.fav_list.forEach((id) => {
        fav_list_ids.push(new mongoose.Types.ObjectId(id));
      });

      result = await pagination(req, service, limit, {
        "area.district": new mongoose.Types.ObjectId(
          req.session.authUser.district
        ),
        "area.ward": { $in: fav_list_ids },
      });
    }
    // Role: Ward Officer
  } else if (req.session.authUser.role === 1) {
    result = await pagination(req, service, limit, {
      area: {
        district: new mongoose.Types.ObjectId(req.session.authUser.district),
        ward: new mongoose.Types.ObjectId(req.session.authUser.ward),
      },
    });
  }

  res.render("vwAds/vwLocations/locations", {
    layout: "ads",
    list: result.data,
    totalPage: result.totalPage,
    page: result.page,
    pageNumbers: result.pageNumbers,
  });
});

router.get("/ad-location/new", authDepartmentRole, async (req, res) => {
  const adsTypeService = new AdsTypesService();
  const locationService = new LocationService();
  const list = await adsTypeService.findAllAdsType();
  const locations = await locationService.findAllLocations();

  res.render("vwAds/vwLocations/create", {
    layout: "ads",
    list,
    locations,
  });
});

router.post("/ad-location/new", async (req, res) => {
  const data = req.body;

  const matchDistrict = data.address.match(/Quận\s[^,]*,\s/);
  const district = matchDistrict ? matchDistrict[0].slice(0, -2) : "Quận 5";
  const matchWard = data.address.match(/Phường\s[^,]*,\s/);
  const ward = matchWard ? matchWard[0].slice(0, -2) : "Phường 4";

  const wardService = new WardService();
  const districtService = new DistrictService();

  const wardId = await wardService.findWardId({ ward });
  const districtId = await districtService.findDistrictId({ district });

  const entity = {
    type: data.type,
    format: Object(data.format),
    zoning: false,
    coordinate: JSON.parse(data.coordinate),
    address: data.address,
    area: {
      district: districtId,
      ward: wardId,
    },
  };

  const locationService = new LocationService();
  await locationService.createLocation(entity);

  res.redirect("/advertisement/ad-location");
});

router.get("/ad-location/:id", async (req, res) => {
  const locationService = new LocationService();
  const locations = await locationService.find({ _id: req.params.id });
  const location = locations[0];

  const adsTypeService = new AdsTypesService();
  const rawAdsTypes = await adsTypeService.findAllAdsType();
  const adsTypes = rawAdsTypes.map((adsType) => {
    return {
      _id: adsType._id,
      name: adsType.name,
      isSelected: adsType._id.toString() === location.format._id.toString(),
    };
  });

  const rawZoning = [
    {
      zoning: true,
      name: "Đã quy hoạch",
    },
    {
      zoning: false,
      name: "Chưa quy hoạch",
    },
  ];
  const zoning = rawZoning.map((zoning) => {
    return {
      zoning: zoning.zoning,
      name: zoning.name,
      isSelected: zoning.zoning === location.zoning,
    };
  });

  res.render("vwAds/vwLocations/detail", {
    layout: "ads",
    location,
    adsTypes,
    zoning,
  });
});

router.post("/ad-location/:id", async (req, res) => {
  const data = {
    type: req.body.type,
    format: Object(req.body.format),
    zoning: req.body.zoning === "true",
  };

  const locationService = new LocationService();
  const result = await locationService.updateLocation(req.params.id, data);

  res.redirect(`/advertisement/ad-location/${req.params.id}`);
});

router.post("/ad-location/can-be-deleted/:id", async (req, res) => {
  const id = req.params.id;
  const advertisementService = new AdvertisementService();
  const result = await advertisementService.canBeDeleted(id);
  res.json(result);
});

router.post("/ad-location/delete/:id", async (req, res) => {
  const id = req.params.id;
  const locationService = new LocationService();
  const result = await locationService.deleteLocation(id);
  res.redirect("/advertisement/ad-location");
});

router.use("/edit-request", editRequestRouter);

router.use("/request", requestRouter);

router.get("/type-ad", authDepartmentRole, async (req, res) => {
  const service = new AdsTypesService();
  const list = await service.findAllAdsType();
  res.render("vwAds/typeAds", {
    layout: "ads",
    list,
  });
});

// Data routers declaration
router.get("/", async (req, res) => {
  const service = new AdvertisementService();
  const coordinate = {
    lat: req.query.lat,
    lng: req.query.lng,
  };
  const list = await service.getAdvertisementsByLocation(coordinate);
  res.send(list);
});

router.get("/generate", async (req, res) => {
  const service = new AdvertisementService();
  const ads = await service.generateAds();
  res.send(ads);
});

router.get("/find-all", async (req, res) => {
  const service = new AdvertisementService();
  const list = await service.getAllAdvertisements();
  res.send(list);
});

router.get("/find-all-by-location/:id", async (req, res) => {
  const service = new AdvertisementService();
  const list = await service.getAllAdvertisementsByLocationId(req.params.id);
  res.send(list);
});

export default router;
