async function contentAd(location) {
  const contentString =
    "<div class='card' style='width: 18rem;padding:0; border:none'>" +
    `<h5 class="card-title">${location.format.name}</h5>` +
    `<p class="card-text">${location.type}</p>` +
    `<p class="card-text">${location.address}</p>` +
    `<p class="card-text" style='font-weight:bold; font-style: italic'>${
      location.zoning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
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

async function getAdLocation(locationId) {
  try {
    const response = await fetch(
      `http://localhost:3000/location/find?id=${locationId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

async function getAds() {
  try {
    const response = await fetch(
      "http://localhost:3000/advertisement/find-all"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function loadAdMarkers(map) {
  const list = await getAds();
  for await (const ad of list) {
    let location = await getAdLocation(ad.location);
    location = location[0];
    const contentString = await contentAd(location);
    map.pushAdMarker(location, location.address, contentString);
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
