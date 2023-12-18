export class Service {
  constructor(IMap) {
    this.map = IMap;
    this.infoWindow = new google.maps.InfoWindow();
  }

  moveToCurrentLocation() {
    const locationButton = document.createElement("button");
    locationButton.innerHTML = '<i class="bi bi-geo-alt"></i> Vị trí hiện tại';

    locationButton.classList.add("btn", "btn-outline-secondary", "otpBtn");

    this.map.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      locationButton
    );

    locationButton.addEventListener("click", async () => {
      try {
        const pos = await this.map.getCurrentLocation();
        this.map.currentLocation = pos;
        this.map.updateCurrentLoc(pos, "Bạn đang ở đây");
        this.map.map.setCenter(pos);
        this.map.map.setZoom(19);
      } catch (error) {
        this.handleLocationError(
          false,
          this.infoWindow,
          this.map.map.getCenter(),
          this.map.map
        );
      }
    });
  }

  showAllMarker() {
    const container = document.createElement("div");
    const toggleAds = document.createElement("div");
    const toggleReports = document.createElement("div");

    toggleAds.innerHTML = `
            <div class="form-check p-2 form-switch d-flex flex-row align-items-center" id="visibleAds">
                <input class="form-check-input p-2" type="checkbox" id="Ads" checked>
                <label class="form-check-label p-2" for="Ads">Bảng QC</label>
            </div>
        `;

    toggleReports.innerHTML = `
            <div class="form-check p-2 form-switch d-flex flex-row align-items-center" id="visibleReports">
                <input class="form-check-input p-2" type="checkbox" id="reports" checked>
                <label class="form-check-label p-2" for="reports">Báo cáo vi phạm</label>
            </div>
        `;

    container.classList.add(
      "d-flex",
      "container-toggle",
      "justify-content-end"
    );
    container.appendChild(toggleAds);
    container.appendChild(toggleReports);

    this.map.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
      container
    );

    toggleAds.addEventListener("change", (event) => {
      this.map.setMapOnAll(event.target.checked ? this.map.map : null);
      event.target.checked
        ? this.map.cluster.addMarkers(
            this.map.marker.map((marker) => marker.marker)
          )
        : this.map.cluster.clearMarkers();
    });
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos, map) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  preloadCaptcha() {
    // Use <div id="captcha"></div> to render captcha
    window.onload = () => {
      // Check if captcha element exists
      const captchaElement = document.querySelector("#captcha");
      if (captchaElement) {
        turnstile.render("#captcha", {
          sitekey: "0x4AAAAAAAOLF5GT_0tyAUJJ",
          theme: "auto",
          callback: (token) => {
            // Store token to session storage
            sessionStorage.setItem("captchaToken", token);
          },
        });
      }
    };
  }

  async verifyCaptcha() {
    const token = sessionStorage.getItem("captchaToken");
    sessionStorage.removeItem("captchaToken");
    
    const response = await fetch("/verify-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });

    const outcome = await response.json();
    console.log(outcome);
  }

  catchUserSelectedLocation() {
    this.map.map.addListener("click", async (event) => {
      // This modified func will allow to show only one userSelectedMarker
      this.map.updateSelectedMarker(event.latLng, "Vị trí bạn chọn");

      // Update banner
      this.map.banners.setBannersForUserSelection(
        await this.map.getDetailsFromCoordinate(event.latLng)
      );
      this.map.sideBar.setContent(1, this.map.banners.root);
      this.map.sideBar.show();
    });
  }

  clusterMarkers() {
    this.map.setCluster();
  }
}
