const status = ["draft", "pending", "active", "expired", "suspended"];
const typeLoc = [
  "Đất công/Công viên/Hành lang an toàn giao thông",
  "Đất tư nhân/Nhà ở riêng lẻ",
  "Trung tâm thương mại",
  "Chợ",
  "Cây xăng",
  "Nhà chờ xe buýt",
];
const typeAds = ["Cổ động chính trị", "Quảng cáo thương mại", "Xã hội hóa"];
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

const minLat = 10.753854;
const maxLat = 10.770785;
const maxLng = 106.692092;
const minLng = 106.672324;

function randomCoordinate() {
  const xhttp = new XMLHttpRequest();
  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lng = Math.random() * (maxLng - minLng) + minLng;
  xhttp.onload = function () {
    const response = JSON.parse(xhttp.responseText)["results"][0];
    const res = {
      address: {
        address_components: response["address_components"],
        formatted_text: response["formatted_address"],
      },
      coordinate: {
        lat: lat,
        lng: lng,
      },
      typeLoc: typeLoc[Math.floor(Math.random() * typeLoc.length)],
      typeAds: typeAds[Math.floor(Math.random() * typeAds.length)],
      typeBoard: typeBoard[Math.floor(Math.random() * typeBoard.length)],
      number: "1 trụ/1 bảng",
      zoning: Math.floor(Math.random() * 10) % 2 === 0,
      size: size[Math.floor(Math.random() * size.length)],
      imgs: [],
      exp: new Date(),
      status: status[Math.floor(Math.random() * status.length)],
    };
    console.log(res);
    // return res;
  };
  xhttp.open(
    "GET",
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCwF9RHdM2Jhzi-hDNJEGvJvEEFos4ViRA`,
    true
  );
  xhttp.send();
}

export default function generateMarker() {
  for (let i = 0; i < 5; i++) {
    randomCoordinate();
  }
}
