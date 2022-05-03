let globalMap = null;
let globalLDO = null;
// Initialize and add the map
initMap = () => {
  // The location of Seoul City Hall
  const seoul = { lat: 37.5666805, lng: 126.9784147 };
  // The map, centered at Seoul
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: seoul,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM,
    },
    mapTypeControl: false,
    fullscreenControl: false
  });
  globalMap = map;
  
  // auto pan control
  const autoPanControlDiv = document.createElement("div");
  AutoPanControl(autoPanControlDiv, map);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(autoPanControlDiv);

  // set LocationDisplayOverlay
  class LocationDisplayOverlay extends google.maps.OverlayView {
    div;
    position;
    constructor(position) {
      super();
      this.position = position;
    }
    onAdd() {
      this.div = document.createElement("div");
      this.div.style.backgroundColor = "#30a065";
      this.div.style.border = "3px solid #fff";
      this.div.style.borderRadius = "10px";
      this.div.style.boxShadow = "0 0 10px #30a065";
      this.div.style.boxSizing = "border-box";
      this.div.style.height = "20px";
      this.div.style.position = "absolute";
      this.div.style.width = "20px";
      // Add the element to the "overlayLayer" pane.
      const panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div);
    }
    draw() {
      const overlayProjection = this.getProjection();
      const pos = overlayProjection.fromLatLngToDivPixel(this.position);
      if (this.div) {
        this.div.style.left = pos.x + "px";
        this.div.style.top = pos.y + "px";
      }
    }
    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        delete this.div;
      }
    }
    hide() {
      if (this.div) {
        this.div.style.visibility = "hidden";
      }
    }
    show() {
      if (this.div) {
        this.div.style.visibility = "visible";
      }
    }
    setPosition(position) {
      this.position = position;
      // this.onRemove();
      this.draw();
    }
  }
  globalLDO = new LocationDisplayOverlay(seoul);
  globalLDO.setMap(map);
  globalLDO.draw();
}
window.initMap = initMap;

// Pan to Current Location
panToCurrentLocation = (map) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.panTo(pos);
      },
      () => {
        handleLocationError(true);
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false);
  }
}

// set LocationDisplayOverlay position to current location
setLDOPosition = (LocationDisplayOverlay) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        LocationDisplayOverlay.setPosition(pos);
      },
      () => {
        handleLocationError(true);
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false);
  }
}

function handleLocationError(browserHasGeolocation) {
  let message = browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.";
  console.error(message);
}

// Auto Pan Control
isAutoPanControlActive = true;
AutoPanControl = (controlDiv, map) => {
  // Set CSS for the control border
  const controlUI = document.createElement("div");
  controlUI.style.alignItems = "center";
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.borderRadius = "2px";
  controlUI.style.boxShadow = "rgb(0 0 0 / 30%) 0px 1px 4px -1px";
  controlUI.style.cursor = "pointer";
  controlUI.style.display = "flex";
  controlUI.style.height = "40px"
  controlUI.style.justifyContent = "center";
  controlUI.style.margin = "10px 10px 20px";
  controlUI.style.width = "40px";
  controlUI.title = "현재 위치 추적";
  controlDiv.appendChild(controlUI);
  // Set CSS for the control intrerior
  const controlText = document.createElement("div");
  controlText.classList.add("material-icons");

  controlText.style.color = "#30a065";
  controlText.style.fontSize = "30px";
  controlText.innerHTML = "gps_fixed";
  controlUI.appendChild(controlText);
  // Setup the click event listeners: make autoPanControl active.
  controlUI.addEventListener("click", () => {
    isAutoPanControlActive = !isAutoPanControlActive;
    if (isAutoPanControlActive) {
      controlText.style.color = "#30a065";
    } else {
      controlText.style.color = "#656565";
    }
  });
}

// set Interval function
setInterval(() => {
  if (isAutoPanControlActive) {
    panToCurrentLocation(globalMap)
  }
  setLDOPosition(globalLDO);
}, 1000)