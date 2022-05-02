let globalMap = null;
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

// set LocationDisplayOverlay
// LocationDisplayOverlay.prototype = new google.maps.OverlayView();
// const overlayDiv = document.createElement("div");
// overlayDiv.style.width = "20px";
// overlayDiv.style.height = "20px";

// set Interval function
setInterval(() => {
  if (isAutoPanControlActive) {
    panToCurrentLocation(globalMap)
  }
}, 1000)