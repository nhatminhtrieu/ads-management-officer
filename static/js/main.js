import { IMap } from "./map/Map.js";
import { Service } from "./service/Service.js";
import loadMarker from "./map/loadMarker.js";
import SideBar from "./service/SideBar.js";

// toggle is false means the side bar is being hidden
var toggle = false;
async function main() {
  const map = new IMap();
  await map.initMap();

  const service = new Service(map);

  service.moveToCurrentLocation();
  service.showAllMarker();
  service.preloadCaptcha();
  await loadMarker(map);
  service.clusterMarkers();
  service.catchUserSelectedLocation();
}

main();
