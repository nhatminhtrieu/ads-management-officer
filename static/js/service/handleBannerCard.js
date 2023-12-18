class Banners {
  constructor() {
    this.root = document.createElement("div");

    this.cardList = document.createElement("div");
    this.cardList.classList.add("card-list");
    this.cardList.id = "card-list";
  }

  createCardForAds(cardInfo) {
    const card = document.createElement("div");
    card.classList.add("card", "card-body");
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerText = cardInfo.typeBoard;

    const address = document.createElement("p");
    address.classList.add("card-text");
    address.innerText = cardInfo.address["formatted_text"];

    const list = document.createElement("ul");
    list.innerHTML = `<li>Kích thước: <em>${cardInfo.size}</em></li>\
      <li>Số lượng: <em>${cardInfo.number}</em></li>\
      <li>Hình thức: <em>${cardInfo.typeAds}</em></li>\
      <li>Phân loại: <em>${cardInfo.typeLoc}</em</li>\
    `;

    const row = document.createElement("div");
    row.classList.add("btn-row");
    row.innerHTML =
      '<button class="btn btn-icon">\
        <i class="bi bi-info-circle"></i>\
        </button>\
        <button class="btn btn-outline-danger">\
        <i class="bi bi-exclamation-octagon-fill"></i> Báo cáo vi phạm\
        </button>\
    ';

    card.appendChild(title);
    card.appendChild(address);
    card.append(list);
    card.appendChild(row);
    return card;
  }

  setBannersForAds(coordinate) {
    // Clear the old banner
    this.cardList.innerHTML = "";

    fetch(
      `http://localhost:3456/advertisement?lat=${coordinate.lat}&lng=${coordinate.lng}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((ads) => {
        ads.forEach((ad) => {
          const card = this.createCardForAds(ad);
          this.cardList.appendChild(card);
          this.root.innerHTML = "";
          this.root.appendChild(this.cardList);
        });
      })
      .catch((error) => console.error(error));
  }

  createCardForNonAds() {
    const card = document.createElement("div");
    card.classList.add("card", "card-body", "non-ads-card", "col-12");

    const row = document.createElement("div");
    row.classList.add("row");

    const leftSide = document.createElement("div");
    leftSide.classList.add("col-1");
    leftSide.innerHTML = '<i class="bi bi-info-circle"></i>';

    const rightSide = document.createElement("div");
    rightSide.classList.add("col-11");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerText = "Thông tin bảng quảng cáo";

    const info = document.createElement("div");
    info.classList.add("card-text");
    info.innerHTML = `<strong> Chưa có dữ liệu! </strong>
        <div>Vui lòng chọn điểm trên bản đồ để xem</div>`;

    rightSide.appendChild(title);
    rightSide.appendChild(info);

    row.appendChild(leftSide);
    row.appendChild(rightSide);

    card.appendChild(row);
    return card;
  }

  createCardForUserSelection(cardInfo) {
    const card = document.createElement("div");
    card.classList.add("card", "card-body", "user-selection-card", "col-12");

    const row = document.createElement("div");
    row.classList.add("row", "mb-3");

    const leftSide = document.createElement("div");
    leftSide.classList.add("col-1");
    leftSide.innerHTML = '<i class="bi bi-check2-circle"></i>';

    const rightSide = document.createElement("div");
    rightSide.classList.add("col-11");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerText = "Thông tin địa điểm";

    const info = document.createElement("div");
    info.classList.add("card-text");
    info.innerHTML = `<strong> ${cardInfo.name} </strong>
        <div> ${cardInfo.address} </div>`;

    const functionRow = document.createElement("div");
    functionRow.classList.add("btn-row");
    // Use empty div to align the button to the right
    functionRow.innerHTML = `<div></div>
      <button class="btn btn-outline-danger">
        <i class="bi bi-exclamation-octagon-fill"></i> Báo cáo vi phạm
      </button>`;

    rightSide.appendChild(title);
    rightSide.appendChild(info);

    row.appendChild(leftSide);
    row.appendChild(rightSide);

    card.appendChild(row);
    card.appendChild(functionRow);
    return card;
  }

  setBannersForUserSelection(cardInfo) {
    // Clear the old banner
    this.cardList.innerHTML = "";

    const card1 = this.createCardForNonAds();
    const card2 = this.createCardForUserSelection(cardInfo);

    this.cardList.appendChild(card1);
    this.cardList.appendChild(card2);
    this.root.innerHTML = "";
    this.root.appendChild(this.cardList);
  }
}

export default Banners;
