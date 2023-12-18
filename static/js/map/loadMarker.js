function createContent(advertisement) {
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
export default async function loadMarker(map) {
  try {
    const response = await fetch(
      "http://localhost:3456/advertisement/locations"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const list = await response.json();
    for await (const ad of list) {
      const contentString = createContent(ad);
      // map.pushMarker(ad.coordinate, ad.title, "ad", contentString);
      map.pushCustomMarker(ad.coordinate, ad.title, contentString, ad.zoning);
    }
  } catch (error) {
    console.error(error);
  }
}
