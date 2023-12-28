// Define your routes here
import express from "express";
const router = express.Router();
import AdvertisementService from "../services/AdvertisementService.js";
import AdsTypesService from "../services/AdsTypeService.js";
import LocationService from "../services/LocationService.js";
import createRequestRouter from "./createRequestRoute.js";

router.get("/locations", async (req, res) => {
	const service = new LocationService();
	const locations = await service.findAllLocations();
	res.send(locations);
});

router.get("/", async (req, res) => {
	const service = new AdvertisementService();
	const coordinate = {
		lat: req.query.lat,
		lng: req.query.lng,
	};
	const list = await service.getAdvertisementsByLocation(coordinate);
	res.send(list);
});

router.get("/manage", (req, res) => {
	res.render("vwAds/ads", { layout: "ads" });
});

router.get("/ad-location", async (req, res) => {
	const service = new LocationService();
	const limit = 20;

	const totalPage = await service.findTotalPages({limit});
	let page = req.query.page || 1;
	if (page < 1) page = 1;
	if (page > totalPage) page = totalPage;
	
	const offset = (page - 1) * limit;

	const data = await service.findDataForPage({ offset, limit });

	const pageNumbers = [];

	for (let i = 1; i <= totalPage; i++) {
		pageNumbers.push({
			value: i,
			isActive: i === +page,
		})
	}

	res.render("vwAds/vwLocations/locations", { 
		layout: "ads",
		list: data,
		totalPage,
		page,
		pageNumbers,
	});
});

router.get('/locations/new', async (req, res) => {
	const service = new AdsTypesService();
	const list = await service.findAllAdsType();
	
	res.render('vwAds/vwLocations/new', { 
		layout: 'ads',
		list
	});
});

router.post('/locations/new', async (req, res) => {
	const data = req.body;
	
	const matchDistrict = data.address.match(/Quận\s[^,]*,\s/);
	const district = matchDistrict ? matchDistrict[0].slice(0, -2) : "Quận 5";
	const matchWard = data.address.match(/Phường\s[^,]*,\s/);
	const ward = matchWard ? matchWard[0].slice(0, -2) : "Phường 4";
	
	const entity = {
		type: data.type,
		format: Object(data.format),
		zoning: false,
		coordinate: JSON.parse(data.coordinate),
		address: data.address,
		area: {
			district,
			ward,
		}
	}
	
	const service = new LocationService();
	await service.createLocation(entity);

	res.redirect('/advertisement/ad-location');
});

router.get("/ad-location/:id", async (req, res) => {
	const service = new LocationService();
	const list = await service.find({_id: req.params.id});
	const location = list[0];
	
	res.render("vwAds/vwLocations/detail", { 
		layout: "ads",
		location,
	});
});

router.get("/edit-request", (req, res) => {
	res.render("vwAds/editRequests", { layout: "ads" });
});

router.use("/create-request", createRequestRouter);

router.get("/type-ad", async (req, res) => {
	const service = new AdsTypesService();
	const list = await service.findAllAdsType();
	res.render("vwAds/typeAds", {
		layout: "ads",
		list,
	});
});

export default router;
