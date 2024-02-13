// Assuming you have your Mapbox access token

mapboxgl.accessToken = "";

// Initialize the map
const map = new mapboxgl.Map({
  container: "map", // container ID
  // light-v10 is the map style to use
  style: "mapbox://styles/mapbox/light-v10",
  center: [-73.98513, 40.758896], // starting position [lng, lat]
  zoom: 12, // starting zoom
});

// Load the GeoJSON data and add it as a source to the map
map.on("load", function () {
  map.addSource("neighborhoods", {
    type: "geojson",
    data: "data.geojson", // path to your GeoJSON file
  });

  // Add a layer to visualize the neighborhoods as polygons and chrolopleth map
  map.addLayer({
    id: "neighborhoods-layer",
    type: "fill",
    source: "neighborhoods",
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "complaints"],
        // adjust the color scale here from teal to white 20 groups 0 to 25000
        0,
        "#d2fbd4",
        3000,
        "#a3f5bf",
        6000,
        "#75efab",
        9000,
        "#47e996",
        12000,
        "#19e382",
        15000,
        "#00c96c",
        20200,
        "#235D71",
      ],
      "fill-opacity": 0.75,
    },
  });

  // Add a layer for the neighborhood borders
  map.addLayer({
    id: "neighborhoods-borders",
    type: "line",
    source: "neighborhoods",
    paint: {
      "line-color": "#000",
      "line-width": 2,
    },
  });

  // add a 3D building layer
  map.addLayer({
    id: "3d-buildings",
    source: "composite",
    "source-layer": "building",
    filter: ["==", "extrude", "true"],
    type: "fill-extrusion",
    minzoom: 15,
    paint: {
      "fill-extrusion-color": "#aaa",
      "fill-extrusion-height": [
        "interpolate",
        ["linear"],
        ["zoom"],
        15,
        0,
        15.05,
        ["get", "height"],
      ],
      "fill-extrusion-base": [
        "interpolate",
        ["linear"],
        ["zoom"],
        15,
        0,
        15.05,
        ["get", "min_height"],
      ],
      "fill-extrusion-opacity": 0.6,
    },
  });

  // create a

  // When a click event occurs on a feature in the neighborhoods-layer, open a popup at the
  // location of the click, with description HTML from its properties.
  map.on("click", "neighborhoods-layer", function (e) {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        `<strong>Neighborhood:</strong> ${e.features[0].properties.Name}<br><strong>Complaints:</strong> ${e.features[0].properties.complaints}`
      )
      .addTo(map);
  });

  // on hover, change the cursor to a pointer and show the neighborhood name and complaints
  map.on("mousemove", "neighborhoods-layer", function (e) {
    map.getCanvas().style.cursor = "pointer";
    const neighborhood = e.features[0].properties.Name;
    const complaints = e.features[0].properties.complaints;
    const neighborhoodInfo = document.getElementById("neighborhood-info");
    neighborhoodInfo.innerHTML = `<h2>${neighborhood}</h2><p>Complaints: ${complaints}</p>`;
  });

  // Change the cursor to a pointer when the mouse is over the neighborhoods-layer.
  map.on("mouseenter", "neighborhoods-layer", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "neighborhoods-layer", function () {
    map.getCanvas().style.cursor = "";
  });
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// add a scale bar to the map
map.addControl(
  new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: "imperial",
  })
);

// Add the geocoder to the map to the left of the map
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: {
      color: "orange",
    },
    placeholder: "Search for a place",
    tooltip: "Search for a place",
    top: "10px",
    left: "10px",
  })
);

// Add the geolocate control to the map
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })
);

// This is a placeholder for the filter functionality that will be implemented in filters.js
// You will need to call this function when the filter changes
function applyFilter(filter) {
  // Ensure that the filter is an array of neighborhood names
  if (!Array.isArray(filter)) {
    console.error("The filter must be an array of neighborhood names.");
    return;
  }

  // Apply the filter to the neighborhoods-layer to show only the neighborhoods in the filter array
  map.setFilter("neighborhoods-layer", [
    "in",
    ["get", "Name"],
    ["literal", filter],
  ]);

  // Update totals display (assuming updateTotals is a function that updates some UI elements)
  updateTotals(filter);

  // Call the calculateAndUpdateTotals function from totals.js (assuming it's a function that calculates totals based on the filter)
  calculateAndUpdateTotals(filter);
}

// This is a placeholder for the updateTotals functionality that will be implemented in totals.js
// You will need to call this function when the filter changes
function updateTotals(filter) {
  // Update the totals display based on the filter
  // ...
  if (typeof calculateAndUpdateTotals === "function") {
    calculateAndUpdateTotals(filter);
  }
}
