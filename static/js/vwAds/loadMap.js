import { loadAdMarkers } from "../loadMarker.js";
import CustomMap from "../map/CustomMap.js";

function onMapChange(returnData) {
	const address = returnData.address.formatted_text;
	const area = returnData.address.address_components[2].long_name;
	$("#address").attr("value", address);
	$("#area").attr("value", area);
}
async function main() {
	const HomeMap = new CustomMap();
	await HomeMap.init(onMapChange);
	// Enable render ad markers function
	await loadAdMarkers(HomeMap);
	HomeMap.setAdCluster();
}

main();
