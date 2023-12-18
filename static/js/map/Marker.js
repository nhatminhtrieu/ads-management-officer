import Banners from "../service/handleBannerCard.js";
export default class CustomMarker {
  #pinCustom = {
    zoning: {
      background: "#6600ff",
      glyph: "QC",
      glyphColor: "#ffffff",
      borderColor: "#6600ff",
    },
    not_zoning: {
      background: "#caa6ff",
      glyph: "QC",
      glyphColor: "#6600ff",
      borderColor: "#caa6ff",
    },
    current: {
      glyph: (() => {
        const glyImg = document.createElement("img");
        glyImg.src = "../../static/assets/CurrentIcon.svg";
        return glyImg;
      })(),
      scale: 0,
    },
    select: {
      background: "#ff0000",
      glyphColor: "#ffffff",
      scale: 1.5,
    },
  };
  #position = {};
  #title = "";
  #type = "";

  constructor(map, position, title, type = "zoning") {
    this.map = map;
    this.marker = null;
    this.#position = position;
    this.#title = title;
    this.#type = type;
  }

  async init() {
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary("marker");
    const pin = new PinElement(this.#pinCustom[this.#type]);
    this.marker = new AdvancedMarkerElement({
      position: this.#position,
      map: this.map,
      title: this.#title,
      content: pin.element,
    });
  }

  addListener(change, onChange) {
    this.marker.addListener(change, onChange);
  }

  setMap(map) {
    this.marker.setMap(map);
  }

  setPosition(position) {
    this.marker.position = position;
  }
}
