export default class GeoService {
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

	async getDetailsFromCoordinate(placeID) {
		const response = await fetch(
			`https://places.googleapis.com/v1/places/${placeID}?fields=displayName,formattedAddress&key=AIzaSyCwF9RHdM2Jhzi-hDNJEGvJvEEFos4ViRA`
		);
		const data = await response.json();
		const firstComponentAddress = data.formattedAddress.split(",")[0];

		if (firstComponentAddress === data.displayName.text)
			return {
				coordinate: placeID,
				name: "Vị trí chưa được đặt tên",
				address: data.formattedAddress,
			};
		else;
		const result = {
			coordinate: placeID,
			name: data.displayName.text,
			address: data.formattedAddress,
		};
		return result;
	}
}
