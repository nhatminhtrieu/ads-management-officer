import { loadAdMarkers } from "../loadMarker.js";
import CustomMap from "../map/CustomMap.js";

function onMapChange(returnData) {
	const address = returnData.formatted_address;
	const area = returnData.address_components[2].long_name;
	const place_id = returnData.place_id;
	$("#address").attr("value", address);
	$("#area").attr("value", area);
	$("#place_id").attr("value", place_id);
	$("#latlng").attr("value", JSON.stringify(returnData.geometry.location));
}
async function main() {
	const HomeMap = new CustomMap();
	await HomeMap.init(onMapChange);
	// Enable catch selected marker function
	await loadAdMarkers(HomeMap);
	HomeMap.catchSelectedLocation();
}

main();
