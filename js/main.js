const { Station, stationManager, StationManager } = require("./stations");

let map;
let infowindow;
let locationIndicator = null;
let markersArray = [];
let startPoint;
let arrivalPoint;
let directionsService;
let directionsRenderer;
let stepDisplay;
// top-group search
const topGroupEl = document.querySelector('.top-group');
const searchTxtEl = document.querySelector('.top-group .search-text');
const searchIconEl = document.querySelector('.top-group .icon-search');
// search window
const searchWindowEl = document.querySelector('.search-window');
const backBtnEl = document.querySelector('.search-window .btn-back');
const searchInputEl = document.querySelector(".search-window .search-text");
const resultContainerEl = document.querySelector(".search-window .result-container");
// menu
const menuBtnEl = document.querySelector('.top-group .btn-menu');
const menuEl = document.querySelector('.menu-window .container');
const dimmerEl = document.querySelector('.menu-window .dimmer');
// route
const routeWindowEl = document.querySelector('.route-window');
const routeBtnBackEl = document.querySelector('.route-window .btn-back');
const startPointInputEl = document.querySelector('.route-window .start-point--search');
const arrivalPointInputEl = document.querySelector('.route-window .arrival-point--search');
const routeResultContainerEl = document.querySelector('.route-window .result-container');
// station map
const subwayMapWindowEl = document.querySelector('.subway-map');
const floorSelectorEl = document.querySelector('.subway-map .floor-selector');
const closeBtnEl = document.querySelector('.subway-map .btn-close');
const stationMapEl = document.querySelector('.subway-map .station-map');

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
  searchIconEl.addEventListener('click', () => {
    searchWindowEl.classList.remove('hidden');
  });

  searchTxtEl.addEventListener('click', () => {
    searchWindowEl.classList.remove('hidden');
  });

  backBtnEl.addEventListener('click', () => {
    clearMarkers();
    if (searchWindowEl.classList.contains('result-view')) {
      placeSearchMode();
      return;
    }
    searchInputEl.value = '';
    resultContainerEl.innerHTML = '';
    isAutoPanControlActive = true;
    mainMode();
  });

  // place search
  infowindow = new google.maps.InfoWindow();
  searchInputEl.addEventListener('input', () => {
    resultContainerEl.innerHTML = '';
    placeSearchMode();
    const request = {
      query: searchInputEl.value,
      fields: ["name", "geometry"]
    };
    let service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          makeResultElement(resultContainerEl, results[i], () => {
            createMarker(results[i]);
            isAutoPanControlActive = false;
            placeFocusMode();
            map.panTo(results[i].geometry.location);
          })
        }
      }
    });
  });
  startPointInputEl.addEventListener('input', () => {
    routeResultContainerEl.innerHTML = '';
    routeSearchMode();
    const request = {
      query: startPointInputEl.value,
      fields: ["name", "geometry"]
    };
    let service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          makeResultElement(routeResultContainerEl, results[i], () => {
            createMarker(results[i]);
            isAutoPanControlActive = false;
            routeSetMode();
            map.panTo(results[i].geometry.location);
          })
        }
      }
    })
    
  });
  arrivalPointInputEl.addEventListener('input', () => {
    routeResultContainerEl.innerHTML = '';
    routeSearchMode();
    const request = {
      query: arrivalPointInputEl.value,
      fields: ["name", "geometry"]
    };
    let service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          makeResultElement(routeResultContainerEl, results[i], () => {
            createMarker(results[i]);
            isAutoPanControlActive = false;
            routeSetMode();
            map.panTo(results[i].geometry.location);
          })
        }
      }
    })
  });

  // directions
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
  stepDisplay = new google.maps.InfoWindow();
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
menuBtnEl.addEventListener('click', () => {
  menuEl.classList.remove('hidden');
  dimmerEl.classList.remove('hidden');
})
dimmerEl.addEventListener('click', () => {
  menuEl.classList.add('hidden');
  dimmerEl.classList.add('hidden');
})

// route window
routeBtnBackEl.addEventListener('click', () => {
  placeFocusMode();
  startPoint = undefined;
  arrivalPoint = undefined;
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
  elementTitle.style.cursor = "pointer";
  elementTitle.style.marginBottom = "5px";

  const elementText = document.createElement('span');
  elementText.textContent = result.formatted_address;
  elementText.style.color = "#656565";
  elementText.style.cursor = "pointer";
  elementText.style.fontFamily = "sans-serif";
  elementText.style.fontSize = "10px";

  elementUI.appendChild(elementTitle);
  elementUI.appendChild(elementText);
  container.appendChild(elementUI);
}

// <SET UI MODE>
// main mode
mainMode = () => {  // topGroup: visible, searchWindow: hidden, routeWindow: hidden
  if (topGroupEl.classList.contains('hidden')) {
    topGroupEl.classList.remove('hidden');
  }
  if (!searchWindowEl.classList.contains('hidden')) {
    searchWindowEl.classList.add('hidden');
  }
  if (routeWindowEl.classList.contains('set-point-mode')) {
    routeWindowEl.classList.remove('set-point-mode');
  }
  if (!routeWindowEl.classList.contains('hidden')) {
    routeWindowEl.classList.add('hidden');
  }
}

// place focus mode
placeFocusMode = () => {  // topGroup: hidden, searchWindow: result-view, routeWindow: hidden
  if (!topGroupEl.classList.contains('hidden')) {
    topGroupEl.classList.add('hidden');
  }
  if (searchWindowEl.classList.contains('hidden')) {
    searchWindowEl.classList.remove('hidden');
  }
  if (!searchWindowEl.classList.contains('result-view')) {
    searchWindowEl.classList.add('result-view');
  }
  if (routeWindowEl.classList.contains('set-point-mode')) {
    routeWindowEl.classList.remove('set-point-mode');
  }
  if (!routeWindowEl.classList.contains('hidden')) {
    routeWindowEl.classList.add('hidden');
  }
}

// search place mode
placeSearchMode = () => { // topGroup: hidden, searchWindow: visible, routeWindow: hidden
  if (!topGroupEl.classList.contains('hidden')) {
    topGroupEl.classList.add('hidden');
  }
  if (searchWindowEl.classList.contains('hidden')) {
    searchWindowEl.classList.remove('hidden');
  }
  if (searchWindowEl.classList.contains('result-view')) {
    searchWindowEl.classList.remove('result-view');
  }
  if (routeWindowEl.classList.contains('set-point-mode')) {
    routeWindowEl.classList.remove('set-point-mode');
  }
  if (!routeWindowEl.classList.contains('hidden')) {
    routeWindowEl.classList.add('hidden');
  }
}

// set route mode
routeSetMode = () => {  // topGroup: hidden, searchWindow: hidden, routeWindow: set-point-mode
  if (!topGroupEl.classList.contains('hidden')) {
    topGroupEl.classList.add('hidden');
  }
  if (!searchWindowEl.classList.contains('hidden')) {
    searchWindowEl.classList.add('hidden');
  }
  if (routeWindowEl.classList.contains('hidden')) {
    routeWindowEl.classList.remove('hidden');
  }
  if (!routeWindowEl.classList.contains('set-point-mode')) {
    routeWindowEl.classList.add('set-point-mode');
  }
}
// search route mode
routeSearchMode = () => { // topGroup: hidden, searchWindow: hidden, routeWindow: visible
  if (!topGroupEl.classList.contains('hidden')) {
    topGroupEl.classList.add('hidden');
  }
  if (!searchWindowEl.classList.contains('hidden')) {
    searchWindowEl.classList.add('hidden');
  }
  if (routeWindowEl.classList.contains('hidden')) {
    routeWindowEl.classList.remove('hidden');
  }
  if (routeWindowEl.classList.contains('set-point-mode')) {
    routeWindowEl.classList.remove('set-point-mode');
  }
}

// createMarker
function createMarker(place) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  markersArray.push(marker);
  const content = document.createElement("div");
  content.style.width = "200px";
  content.style.padding = "5px";

  const nameEl = document.createElement("h1");
  nameEl.textContent = place.name;
  nameEl.style.marginBottom = "5px";

  const addressEl = document.createElement("span");
  addressEl.textContent = place.formatted_address;
  addressEl.style.color = "#656565";
  addressEl.style.fontFamily = "sans-serif";
  addressEl.style.fontSize = "10px";
  addressEl.style.marginBottom = "15px";

  const btnGroup = document.createElement("div");
  btnGroup.style.display = "flex";
  btnGroup.style.flexDirection = "row-reverse";

  const btnStart = document.createElement("div");
  btnStart.textContent = "출발";
  btnStart.style.backgroundColor = "#30a065";
  btnStart.style.borderRadius = "3px";
  btnStart.style.color = "#fff";
  btnStart.style.cursor = "pointer";
  btnStart.style.fontFamily = "sans-serif";
  btnStart.style.fontSize = "14px"
  btnStart.style.fontWeight = "700";
  btnStart.style.marginLeft = "10px";
  btnStart.style.padding = "5px";
  btnStart.addEventListener("click", () => {
    routeSetMode();
    startPointInputEl.value = place.name;
    startPoint = place;
    infowindow.close();
    if (startPoint && arrivalPoint) {
      calculateAndDisplayRoute(
        directionsRenderer,
        directionsService,
        markersArray,
        stepDisplay,
        map
      );
    }
  })

  const btnArrival = document.createElement("div");
  btnArrival.textContent = "도착";
  btnArrival.style.backgroundColor = "#30a065";
  btnArrival.style.borderRadius = "3px";
  btnArrival.style.color = "#fff";
  btnArrival.style.cursor = "pointer";
  btnArrival.style.fontFamily = "sans-serif";
  btnArrival.style.fontSize = "14px"
  btnArrival.style.fontWeight = "700";
  btnArrival.style.marginLeft = "10px";
  btnArrival.style.padding = "5px";
  btnArrival.addEventListener("click", () => {
    routeSetMode();
    arrivalPointInputEl.value = place.name;
    arrivalPoint = place;
    infowindow.close();
    if (startPoint && arrivalPoint) {
      calculateAndDisplayRoute(
        directionsRenderer,
        directionsService,
        markersArray,
        stepDisplay,
        map
      );
    }
  })

  btnGroup.appendChild(btnArrival);
  btnGroup.appendChild(btnStart);

  content.appendChild(nameEl);
  content.appendChild(addressEl);
  content.appendChild(btnGroup);
  
  infowindow.setContent(content);
  infowindow.open(map, marker);
  google.maps.event.addListener(marker, "click", () => {
    infowindow.open(map, marker);
  });
}

// Remove All Marker
function clearMarkers() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

// directions
calculateAndDisplayRoute = (
  directionsRenderer,
  directionsService,
  markersArray,
  stepDisplay,
  map
) => {
  clearMarkers();
  directionsService
    .route({
      origin: startPoint.geometry.location,
      destination: arrivalPoint.geometry.location,
      travelMode: google.maps.TravelMode.TRANSIT
    })
    .then((result) => {
      directionsRenderer.setDirections(result);
      showSteps(result, markersArray, stepDisplay, map);
      console.log(result);
    })
    .catch((e) => {
      window.alert("Directions request failed due to " + e);
    });
}
showSteps = (directionResult, markersArray, stepDisplay, map) => {
  const myRoute = directionResult.routes[0].legs[0];

  for (let i = 0; i < myRoute.steps.length; i++) {
    const marker = (markersArray[i] =
      markersArray[i] || new google.maps.Marker());

    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    const content = document.createElement('div');
    content.style.fontFamily = "sans-serif";
    content.style.fontWeight = "400";
    content.style.color = "#000";
    content.style.fontSize = "16px";
    if (myRoute.steps[i].transit) {
      const transit = myRoute.steps[i].transit;
      const lineEl = document.createElement('div');
      lineEl.innerHTML = `${transit.line.short_name || transit.line.name}`;
      lineEl.style.color = transit.line.color;
      lineEl.style.fontWeight = "700";
      lineEl.style.marginBottom = "5px";
      
      const departureStopEl = document.createElement('div');
      departureStopEl.innerHTML = `<b>${transit.departure_stop.name}</b>에서 승차`;
      departureStopEl.style.marginBottom = "3px";
      departureStopEl.style.marginLeft = "3px";

      const stopsBetweenEl = document.createElement('div');
      stopsBetweenEl.innerHTML = `${transit.num_stops}개 정류장 이동\n약 ${myRoute.steps[i].duration.text} 소요`
      stopsBetweenEl.style.color = "#656565"
      stopsBetweenEl.style.fontSize = "14px";
      stopsBetweenEl.style.marginBottom = "3px";
      stopsBetweenEl.style.marginLeft = "3px";

      const arrivalStopEl = document.createElement('div');
      arrivalStopEl.innerHTML = `<b>${transit.arrival_stop.name}</b>에서 하차`;
      arrivalStopEl.style.marginLeft = "3px";
      content.appendChild(lineEl);
      content.appendChild(departureStopEl);
      content.appendChild(stopsBetweenEl);
      content.appendChild(arrivalStopEl);

      if (transit.line.vehicle.type === "SUBWAY") {
        const btnGroup = document.createElement('div');
        btnGroup.style.display = "flex"
        btnGroup.style.marginTop = "5px";

        const btnSubwayMapDisplay = document.createElement('span');
        btnSubwayMapDisplay.textContent = "역사 지도";
        btnSubwayMapDisplay.style.backgroundColor = "#30a065";
        btnSubwayMapDisplay.style.borderRadius = "3px";
        btnSubwayMapDisplay.style.color = "#fff";
        btnSubwayMapDisplay.style.cursor = "pointer";
        btnSubwayMapDisplay.style.fontFamily = "sans-serif";
        btnSubwayMapDisplay.style.fontSize = "14px"
        btnSubwayMapDisplay.style.fontWeight = "700";
        btnSubwayMapDisplay.style.padding = "5px";
        btnSubwayMapDisplay.addEventListener('click', () => {subwayMapDisplay(transit.departure_stop.name)});

        const btnElevatorDisplay = document.createElement('span');
        btnElevatorDisplay.textContent = "승강기 위치";
        btnElevatorDisplay.style.backgroundColor = "#30a065";
        btnElevatorDisplay.style.borderRadius = "3px";
        btnElevatorDisplay.style.color = "#fff";
        btnElevatorDisplay.style.cursor = "pointer";
        btnElevatorDisplay.style.fontFamily = "sans-serif";
        btnElevatorDisplay.style.fontSize = "14px"
        btnElevatorDisplay.style.fontWeight = "700";
        btnElevatorDisplay.style.padding = "5px";

        btnGroup.appendChild(btnSubwayMapDisplay);
        btnGroup.appendChild(btnElevatorDisplay);
        content.appendChild(btnGroup);
      }
    } else {
      content.textContent = myRoute.steps[i].instructions;
    }
    google.maps.event.addListener(marker, "click", () => {
      stepDisplay.setContent(content);
      stepDisplay.open(map, marker);
    });
  }
}

// subway map display
// StationManager = require("./stations");
// Station = require("./stations");
// stationManager = require("./stations");

const defaultImg = require('../images/default-station-image.jpg');
closeBtnEl.addEventListener('click', () => {
  subwayMapWindowEl.classList.add('hidden');
  floorSelectorEl.innerHTML = '';
})
subwayMapDisplay = (stationName) => {
  let station = stationManager.getStation(stationName);
  if (station) {
    let floors = station.getFloorNum();
    if (station.getImgSrc()) stationMapEl.src = station.getImgSrc()[0];
    for (let i = floors[0]; i <= floors[1]; i++) {
      const btnFloor = document.createElement('div');
      btnFloor.classList.add('btn-floor');
      if (i < 0) {
        btnFloor.textContent = `지하 ${-i}층`;
      } else {
        btnFloor.textContent = `${i+1}층`;
      }
      btnFloor.addEventListener('click', () => {
        let el = floorSelectorEl.firstChild;
        if (el.classList.contains('active')) el.classList.remove('active');
        while (el = el.nextSibling) {
          if (el.classList.contains('active')) el.classList.remove('active');
        }
        if (station.getImgSrc()[i - floors[0]]) stationMapEl.src = station.getImgSrc()[i - floors[0]];
        else stationMapEl.src = defaultImg;
        btnFloor.classList.add('active');
      })
      floorSelectorEl.appendChild(btnFloor);
    }
  }
  // floorSelectorEl;
  // stationMapEl;
  if (subwayMapWindowEl.classList.contains('hidden')) {
    subwayMapWindowEl.classList.remove('hidden');
  }
}

// set Interval function
setInterval(() => {
  if (isAutoPanControlActive) {
    panToCurrentLocation(map)
  }
  setLDOPosition(locationIndicator);
}, 1000)