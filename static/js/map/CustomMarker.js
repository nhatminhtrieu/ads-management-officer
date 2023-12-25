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
	#pinSvgString = {
		resolved:
			'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10ZM10 4.25C10.1989 4.25 10.3897 4.32902 10.5303 4.46967C10.671 4.61032 10.75 4.80109 10.75 5V11C10.75 11.1989 10.671 11.3897 10.5303 11.5303C10.3897 11.671 10.1989 11.75 10 11.75C9.80109 11.75 9.61032 11.671 9.46967 11.5303C9.32902 11.3897 9.25 11.1989 9.25 11V5C9.25 4.80109 9.32902 4.61032 9.46967 4.46967C9.61032 4.32902 9.80109 4.25 10 4.25ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z" fill="#FF7A00"/></svg>',
		issued:
			'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10ZM10 4.25C10.1989 4.25 10.3897 4.32902 10.5303 4.46967C10.671 4.61032 10.75 4.80109 10.75 5V11C10.75 11.1989 10.671 11.3897 10.5303 11.5303C10.3897 11.671 10.1989 11.75 10 11.75C9.80109 11.75 9.61032 11.671 9.46967 11.5303C9.32902 11.3897 9.25 11.1989 9.25 11V5C9.25 4.80109 9.32902 4.61032 9.46967 4.46967C9.61032 4.32902 9.80109 4.25 10 4.25ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z" fill="#FFC28A"/></svg>',
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
		const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
		const parser = new DOMParser();
		let pin = null;
		if (this.#pinCustom[this.#type]) {
			pin = new PinElement(this.#pinCustom[this.#type]);
		} else
			pin = {
				element: parser.parseFromString(this.#pinSvgString[this.#type], "image/svg+xml")
					.documentElement,
			};
		this.marker = new AdvancedMarkerElement({
			position: this.#position,
			map: this.map,
			title: this.#title,
			content: pin.element,
		});
		return this.marker;
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
