let map;
let locationIndicator = null;
// Initialize and add the map
initMap = () => {
  // The location of Seoul City Hall
  const seoul = { lat: 37.5666805, lng: 126.9784147 };
  // The map, centered at Seoul
  map = new google.maps.Map(document.getElementById("map"), {
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
    }
  }
  locationIndicator = new LocationDisplayOverlay(seoul);
  locationIndicator.setMap(map);

  // search window
  const searchTxtEl = document.querySelector('.top-group .search-text');
  const searchIconEl = document.querySelector('.top-group .icon-search')
  const searchWindowEl = document.querySelector('.search-window');
  const backBtnEl = document.querySelector('.search-window .btn-back')

  searchIconEl.addEventListener('click', () => {
    searchWindowEl.classList.remove('hidden');
  });

  searchTxtEl.addEventListener('click', () => {
    searchWindowEl.classList.remove('hidden');
  });

  backBtnEl.addEventListener('click', () => {
    searchWindowEl.classList.add('hidden');
  });

  // place search
  const searchInputEl = document.querySelector(".search-window .search-text");
  const searchBtnEl = document.querySelector(".search-window .btn-search");
  const resultContainerEl = document.querySelector(".search-window .result-container");

  searchInputEl.addEventListener("input", () => {
    resultContainerEl.innerHTML = '';
  })

  searchBtnEl.addEventListener("click", () => {
    const request = {
      query: searchInputEl.value,
      fields: ["name", "geometry"]
    };
    let service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          console.log(results[i]);
          makeResultElement(resultContainerEl, results[i], () => {
            createMarker(results[0].geometry.location);
            isAutoPanControlActive = false;
            map.setCenter(results[0].geometry.location);
          })
        }
      }
    });
  })

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

// menu window
const menuBtnEl = document.querySelector('.top-group .btn-menu');
const menuEl = document.querySelector('.menu-window .container');
const dimmerEl = document.querySelector('.menu-window .dimmer');

menuBtnEl.addEventListener('click', () => {
  menuEl.classList.remove('hidden');
  dimmerEl.classList.remove('hidden');
})
dimmerEl.addEventListener('click', () => {
  menuEl.classList.add('hidden');
  dimmerEl.classList.add('hidden');
})

// create result element
makeResultElement = (container, result, clickEvent) => {
  const elementUI = document.createElement('div');
  elementUI.style.backgroundColor = "#fff";
  elementUI.style.borderBottom = "1px solid #656565";
  elementUI.style.overflow = "hidden";
  elementUI.style.padding = "10px 40px 10px";
  elementUI.addEventListener("click", clickEvent)

  const elementTitle = document.createElement('h1');
  elementTitle.textContent = result.name;
  elementTitle.style.marginBottom = "5px";

  const elementText = document.createElement('span');
  elementText.textContent = result.formatted_address;
  elementText.style.color = "#656565";
  elementText.style.fontFamily = "sans-serif";
  elementText.style.fontSize = "10px";

  elementUI.appendChild(elementTitle);
  elementUI.appendChild(elementText);
  container.appendChild(elementUI);
}

// createMarker
function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

// set Interval function
setInterval(() => {
  if (isAutoPanControlActive) {
    panToCurrentLocation(map)
  }
  setLDOPosition(locationIndicator);
}, 1000)