import { loadSingleAdMarker } from "../loadMarker.js";
import CustomMap from "../map/CustomMap.js";

function onMapChange(returnData) {
	// Do nothing
}

async function main() {
	const id = window.location.pathname.split('/').pop();
	const HomeMap = new CustomMap();
	await HomeMap.init(onMapChange);
	await loadSingleAdMarker(HomeMap, id)
}

main();
