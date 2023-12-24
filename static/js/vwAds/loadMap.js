import { Service } from "../service/Service.js";
import loadMarker from "../map/loadMarker.js";

import CustomMarker from "../map/Marker.js";

export class IMap {
	constructor() {
		this.map = null;
		this.marker = [];
		this.currentMarker = null;
		this.infoWindow = null;
		this.cluster = null;
		this.selectedMarker = null;
	}

	async initMap() {
		await google.maps.importLibrary("maps");
		this.currentLocation = await this.getCurrentLocation();

		this.infoWindow = new google.maps.InfoWindow();
		this.infoWindow.addListener("closeclick", () => {
			this.selectedMarker = null;

			$("#address").attr("value", "");
			$("#area").attr("value", "");
		});

		const styledMapType = new google.maps.StyledMapType([
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
		]);

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

		this.map.mapTypes.set("map", styledMapType);
		this.map.setMapTypeId("map");
		this.updateCurrentLoc(this.currentLocation, "Bạn đang ở đây");
		this.initCluster();
		return this.map;
	}

	async getCurrentLocation() {
		const pos = await new Promise((resolve, reject) => {
			if (!navigator.geolocation) reject("Geolocation is not supported by your browser");

			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				() => {
					// If user denied permission, current location is at HCMUS
					resolve({
						lat: 10.762838024314062,
						lng: 106.68248463223016,
					});
				},
				{
					// This options means that getCurrentPosition will wait for 5s before timeout
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0,
				}
			);
		});
		return pos;
	}

	async pushCustomMarker(position, title, content = title, zoning = true, location) {
		const marker = new CustomMarker(this.map, position, title, zoning ? "zoning" : "not_zoning");
		await marker.init();

		marker.addListener("click", () => {
			// Update and open info window
			this.infoWindow.setContent(content);
			this.infoWindow.open({
				anchor: marker.marker,
				map: this.map,
			});
			this.selectedMarker = marker;
			console.log(typeof location.address.formatted_text);
			console.log(location.address.address_components[2].long_name);
			$("#address").attr("value", location.address.formatted_text);
			$("#area").attr("value", location.address.address_components[2].long_name);
		});
		this.marker.push(marker);
	}

	updateCurrentLoc(position, title) {
		// Update position of the marker
		if (this.currentMarker) {
			this.currentMarker.setPosition(position);
		} else {
			const marker = new CustomMarker(this.map, position, title, "current");
			marker.init().then(() => {
				// Set new marker
				this.currentMarker = marker;
			});
		}
	}

	initCluster() {
		const markers = this.marker.map((marker) => marker.marker);
		const map = this.map;
		this.cluster = new markerClusterer.MarkerClusterer({ markers, map });
	}

	setCluster() {
		const markers = this.marker.map((marker) => marker.marker);
		this.cluster.addMarkers(markers);
	}

	removeCluster() {
		this.cluster.clearMarkers();
	}
}

async function main() {
	const map = new IMap();
	await map.initMap();

	const service = new Service(map);
	await loadMarker(map);
	service.clusterMarkers();
}

main();
