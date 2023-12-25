import { loadAdMarkers, loadReportMarkers } from "../map/loadMarker.js";
import CustomMap from "../map/CustomMap.js";

function onMapChange(returnData) {
	console.log(returnData);
	$("#map-return-data").html(JSON.stringify(returnData));
}

async function main() {
	const HomeMap = new CustomMap();
	await HomeMap.init(onMapChange);
	await loadAdMarkers(HomeMap);
	await loadReportMarkers(HomeMap);
	HomeMap.setAdCluster();
	HomeMap.setReportCluster();
	HomeMap.catchSelectedLocation();
}

main();
