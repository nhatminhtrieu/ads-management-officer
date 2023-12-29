import DistrictService from "../../services/DistrictService.js";
import WardService from "../../services/WardService.js";

const type = [
  "Đất công/Công viên/Hành lang an toàn giao thông",
  "Đất tư nhân/Nhà ở riêng lẻ",
  "Trung tâm thương mại",
  "Chợ",
  "Cây xăng",
  "Nhà chờ xe buýt",
];
const format = [
  {
    $oid: "65893669757e98bdbabec692",
  },
  {
    $oid: "65893674757e98bdbabec696",
  },
  {
    $oid: "6589367a757e98bdbabec69a",
  },
];
const minLat = 10.753854;
const maxLat = 10.770785;
const maxLng = 106.692092;
const minLng = 106.672324;
const wardDistrict1 = [
  "Phường Bến Nghé",
  "Phường Bến Thành",
  "Phường Cầu Kho",
  "Phường Cầu Ông Lãnh",
  "Phường Cô Giang",
  "Phường Đa Kao",
  "Phường Nguyễn Cư Trinh",
  "Phường Nguyễn Thái Bình",
  "Phường Phạm Ngũ Lão",
  "Phường Tân Định",
];
const districtService = new DistrictService();
const wardService = new WardService();

async function formatDistrict(district) {
  try {
    const result = await districtService.findDistrictByName(district);
    if (result) return { $oid: result._id };
    return district;
  } catch (error) {
    console.error(error);
  }
}

async function formatWard(district, ward) {
  try {
    const result = await wardService.findWardByEntity({ district, ward });
    if (result) return { $oid: result._id };
    return ward;
  } catch (error) {
    console.error(error);
  }
}

async function formatData(response, zoning, lat, lng) {
  const adsType = format[Math.floor(Math.random() * format.length)];
  const address_components = response.results[0].address_components;
  const formatted_address = response.results[0].formatted_address;
  const districtIndex = formatted_address.indexOf("Quận");
  const wardIndex = formatted_address.indexOf("Phường");
  var district = "";
  var ward = "";

  address_components.forEach((type) => {
    type["long_name"].includes("Quận") && (district = type["long_name"]);
    type["long_name"].includes("Phường") && (ward = type["long_name"]);
  });

  if (district === "") {
    formatted_address.indexOf("Quận") !== -1
      ? (district = formatted_address.substring(
          districtIndex,
          formatted_address.indexOf(",", districtIndex)
        ))
      : (district = `Quận ${Math.random() < 0.5 ? 1 : 5}`);
  }

  if (ward === "") {
    formatted_address.indexOf("Phường") !== -1
      ? (ward = formatted_address.substring(
          wardIndex,
          formatted_address.indexOf(",", wardIndex)
        ))
      : district === "Quận 5"
      ? (ward = `Phường ${Math.floor(Math.random() * 14) + 1}`)
      : (ward =
          wardDistrict1[Math.floor(Math.random() * wardDistrict1.length)]);
  }

  if (district == "Quận 5" || district == "Quận 1") {
    district = await formatDistrict(district);
    ward = await formatWard(district["$oid"], ward);
  }

  return {
    type: type[Math.floor(Math.random() * type.length)],
    adsType,
    zoning,
    coordinate: {
      lat,
      lng,
    },
    address: formatted_address,
    area: { district, ward },
  };
}

async function randomCoordinate() {
  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lng = Math.random() * (maxLng - minLng) + minLng;
  const zoning = Math.random() >= 0.5;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    const res = await formatData(result, zoning, lat, lng);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export default async function generateLocation() {
  var list = [];
  for (let i = 0; i < 50; i++) {
    const coordinate = await randomCoordinate();
    list.push(coordinate);
  }
  return list;
}
