import { loadAdMarkers, loadReportMarkers } from "../loadMarker.js";
import CustomMap from "../map/CustomMap.js";

function onMapChange(returnData) {
	$("#map-return-data").html(JSON.stringify(returnData));
}

async function main() {
	const HomeMap = new CustomMap();
	await HomeMap.init(onMapChange);
	// Enable render ad markers function
	await loadAdMarkers(HomeMap);
	HomeMap.setAdCluster();
	// Enable render report markers function
	await loadReportMarkers(HomeMap);
	HomeMap.setReportCluster();
	// Enable catch selected marker function
	HomeMap.catchSelectedLocation();
}

main();
