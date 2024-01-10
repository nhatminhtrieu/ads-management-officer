export function contentAd(location) {
	const contentString =
		"<div class='card' style='width: 18rem;padding:0; border:none'>" +
		`<h5 class="card-title">${location.format.name}</h5>` +
		`<p class="card-text">${location.type}</p>` +
		`<p class="card-text">${location.address}</p>` +
		`<p class="card-text" style='font-weight:bold; font-style: italic'>${location.zoning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
		}</p>` +
		"</div>";
	return contentString;
}

export function contentReport(report) {
	const contentString =
		"<div class='card' style='width: 18rem;padding:0; border:none'>" +
		`<h5 class="card-title">${report.typeReportName}</h5>` +
		`<p class="card-text">${report.email}</p>` +
		`<p class="card-text" style='font-weight:bold; font-style: italic'>${report.type === "Đã tiếp nhận" ? "ĐÃ TIẾP NHẬN" : "ĐÃ XỬ LÝ"
		}</p>` +
		"</div>";
	return contentString;
}

export async function loadAdMarkers(map) {
	const list = await getLocations();
	for await (const location of list) {
		const contentString = contentAd(location);
		map.pushAdMarker(location, location.address, contentString);
	}
}