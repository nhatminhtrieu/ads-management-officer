function contentAd(advertisement) {
	const contentString =
		"<div class='card' style='width: 18rem;padding:0; border:none'>" +
		`<h5 class="card-title">${advertisement.typeAds}</h5>` +
		`<p class="card-text">${advertisement.typeLoc}</p>` +
		`<p class="card-text">${advertisement.address.formatted_text}</p>` +
		`<p class="card-text" style='font-weight:bold; font-style: italic'>${
			advertisement.zoning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
		}</p>` +
		"</div>";
	return contentString;
}

function contentReport(report) {
	const contentString =
		"<div class='card' style='width: 18rem;padding:0; border:none'>" +
		`<h5 class="card-title">${report.typeReport}</h5>` +
		`<p class="card-text">${report.email}</p>` +
		`<p class="card-text" style='font-weight:bold; font-style: italic'>${
			report.type === "issued" ? "CHƯA XỬ LÝ" : "ĐÃ XỬ LÝ"
		}</p>` +
		"</div>";
	return contentString;
}

export async function loadAdMarkers(map) {
	try {
		const response = await fetch("http://localhost:3000/advertisement/locations");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const list = await response.json();
		for await (const ad of list) {
			const contentString = contentAd(ad);
			map.pushAdMarker(ad, ad.address.formatted_text, contentString);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function loadReportMarkers(map) {
	try {
		const response = await fetch("http://localhost:3000/report/all");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const list = await response.json();
		for await (const report of list) {
			const contentString = contentReport(report);
			map.pushReportMarker(report, report.typeReport, contentString);
		}
	} catch (error) {
		console.error(error);
	}
}
