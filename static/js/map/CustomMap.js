import GeoService from "./GeoService.js";
import CustomMarker from "./CustomMarker.js";

export default class CustomMap {
	constructor() {
		this.map = null;
		this.adMarker = {
			markers: [],
			cluster: null,
		};
		this.reportMarker = {
			markers: [],
			cluster: null,
		};
		this.currentLocation = null;
		this.currentMarker = null;
		this.selectedMarker = null;
		this.infoWindow = null;
		this.returnData = null;
		this.handleChange = (_data) => {};
	}

	// Private variables
	#styledMapTypes = [
		{
			featureType: "transit.station",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
		{
			featureType: "poi",
			elementType: "labels.text",
			stylers: [{ visibility: "on" }],
		},
	];

	// Private methods
	#initCluster() {
		this.initCluster(this.adMarker);
		this.initCluster(this.reportMarker);
	}

	async init(onChange) {
		if (typeof onChange == "function") {
			console.log("On change function is passed by");
			this.handleChange = onChange;
		}
		await google.maps.importLibrary("maps");
		const geolocation = new GeoService();
		this.currentLocation = await geolocation.getCurrentLocation();

		this.map = new google.maps.Map(document.getElementById("map"), {
			center: this.currentLocation,
			zoom: 16,
			mapId: "adf136d39bc00bf9",
			// Only use normal map type
			mapTypeControlOptions: {
				mapTypeIds: ["roadmap"],
			},
			mapTypeControl: false,
		});

		// Config styled map types
		const styledMapType = new google.maps.StyledMapType(this.#styledMapTypes);
		this.map.mapTypes.set("map", styledMapType);
		this.map.setMapTypeId("map");

		// Create only one infoWindow
		this.infoWindow = new google.maps.InfoWindow();
		this.infoWindow.addListener("closeclick", () => {
			this.selectedMarker = null;
			this.returnData = null;
			this.handleChange(this.returnData);
		});

		this.updateCurrentLoc(this.currentLocation);
		this.#initCluster();

		return this.map;
	}

	initCluster(MarkersObject) {
		const markers = MarkersObject.markers.map((marker) => marker.marker);
		const map = this.map;
		MarkersObject.cluster = new markerClusterer.MarkerClusterer({ markers, map });
	}

	setAdCluster() {
		const markers = this.adMarker.markers.map((marker) => marker.marker);
		this.adMarker.cluster.addMarkers(markers);
	}

	setReportCluster() {
		const markers = this.reportMarker.markers.map((marker) => marker.marker);
		this.reportMarker.cluster.addMarkers(markers);
	}

	removeCluster(MarkersObject) {
		MarkersObject.cluster.clearMarkers(markers);
	}

	updateCurrentLoc(position) {
		// Update position of the marker
		if (this.currentMarker) {
			this.currentMarker.setPosition(position);
		} else {
			const marker = new CustomMarker(this.map, position, "Bạn đang ở đây", "current");
			marker.init().then((result) => {
				// Set new marker
				this.currentMarker = result;
			});
		}
	}

	async pushAdMarker(location, title, content = title) {
		const marker = new CustomMarker(
			this.map,
			location.coordinate,
			title,
			location.zoning ? "zoning" : "not_zoning"
		);
		await marker.init();

		marker.addListener("click", () => {
			// Update and open info window
			this.infoWindow.setContent(content);
			this.infoWindow.open({
				anchor: marker.marker,
				map: this.map,
			});
			this.selectedMarker && this.selectedMarker.setMap(null);
			this.returnData = location;
			this.handleChange(this.returnData);
		});

		this.adMarker.markers.push(marker);
	}

	async pushReportMarker(report, title, content = title) {
		const marker = new CustomMarker(this.map, report.coordinate, title, report.type);
		await marker.init();

		marker.addListener("click", () => {
			// Update and open info window
			this.infoWindow.setContent(content);
			this.infoWindow.open({
				anchor: marker.marker,
				map: this.map,
			});
			this.selectedMarker && this.selectedMarker.setMap(null);
			this.returnData = report;
			this.handleChange(this.returnData);
		});

		this.reportMarker.markers.push(marker);
	}

	getPlacesID(latlng) {
		const geocoder = new google.maps.Geocoder();
		return new Promise((resolve, reject) => {
			geocoder
				.geocode({ location: latlng })
				.then((response) => {
					if (response.results[0]) resolve(response.results[0].place_id);
					else reject("No results found");
				})
				.catch((e) => reject("Geocoder failed due to: " + e));
		});
	}

	updateSelectedMarker(position) {
		const geocoder = new google.maps.Geocoder();
		geocoder
			.geocode({ location: position })
			.then((response) => {
				if (response.results[0]) {
					this.returnData = response.results[0];
					this.handleChange(this.returnData);
				} else console.error("No results found");
			})
			.catch((e) => console.error("Geocoder failed due to: " + e));

		// Clear old marker if exist
		if (this.selectedMarker) {
			this.selectedMarker.setMap(this.map);
			this.selectedMarker.setPosition(position);
			this.infoWindow.close();
		} else {
			const marker = new CustomMarker(this.map, position, "Vị trí bạn chọn", "select");
			marker.init().then(() => {
				// Set new marker
				this.selectedMarker = marker;
			});
		}
	}

	catchSelectedLocation() {
		this.map.addListener("click", (event) => {
			this.updateSelectedMarker(event.latLng);
		});
	}

	async setCenter(position) {
		this.map.setCenter(position);
		this.map.setZoom(16);
	}
}
