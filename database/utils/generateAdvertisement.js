import DistrictService from "../../services/DistrictService.js";
import WardService from "../../services/WardService.js";
import LocationRepository from "../repositories/LocationRepository.js";

const typeBoard = [
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
const size = ["2.5m x 10m", "5m x 5m", "1m x 1.5m"];
const imgs = [
  "https://images.unsplash.com/photo-1553096442-8fe2118fb927?ixid=M3w1NDE3MjR8MHwxfHNlYXJjaHwxfHxhZHZlcnRpc2VtZW50fGVufDB8fHx8MTcwMjc0NjU0MHww&ixlib=rb-4.0.3",
];

async function randomAd() {
  try {
    const repository = new LocationRepository();
    const locations = await repository.findAll();
    return {
      typeBoard: typeBoard[Math.floor(Math.random() * typeBoard.length)],
      number: "1 trụ/1 bảng",
      size: size[Math.floor(Math.random() * size.length)],
      imgs,
      start: new Date(),
      end: new Date(),
      location: {
        $oid: locations[Math.floor(Math.random() * locations.length)]._id,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export default async function generateAdvertisement() {
  var list = [];
  for (let i = 0; i < 50; i++) {
    const ad = await randomAd();
    list.push(ad);
  }
  return list;
}
