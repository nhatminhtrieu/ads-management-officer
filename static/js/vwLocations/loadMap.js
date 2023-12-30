import { loadAdMarkers } from "../loadMarker.js";
import CustomMap from "../map/CustomMap.js";

function onMapChange(returnData) {
	// Hide alert
	$('#alert').prop("hidden", true);
	
	// If it has '_id' then it comes from database
	// If it doesn't have '_id' then it comes from google map
	// If no returnData then user click X on infoWindow
	if (!returnData || returnData.hasOwnProperty("_id")) {
		$("#address").attr("value", "");
		$("#place_id").attr("value", "");
		$("#latlng").attr("value", "");

		// If that point exists in database, show alert
		if (returnData)
			$('#alert').prop("hidden", false);
	} else
	{
		const address = returnData.formatted_address;
		const place_id = returnData.place_id;
		$("#address").attr("value", address);
		$("#place_id").attr("value", place_id);
		$("#latlng").attr("value", JSON.stringify(returnData.geometry.location));
	}
}

async function main() {
	const HomeMap = new CustomMap();
	await HomeMap.init(onMapChange);
	// Enable catch selected marker function
	await loadAdMarkers(HomeMap);
	HomeMap.catchSelectedLocation();
}

main();
