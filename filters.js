// filters.js

// Function to extract unique neighborhoods from the GeoJSON data
function getNeighborhoods(data) {
  const neighborhoods = new Set();
  data.features.forEach((feature) => {
    neighborhoods.add(feature.properties.Name);
  });
  return Array.from(neighborhoods);
}

// Function to create filter checkboxes and append them to the sidebar
function createFilterCheckboxes(neighborhoods) {
  const filtersDiv = document.getElementById("filters");
  neighborhoods.forEach((neighborhood) => {
    const container = document.createElement("div");
    container.className = "filter-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `filter-${neighborhood}`;
    checkbox.value = neighborhood;
    checkbox.checked = true;
    checkbox.onchange = handleFilterChange;

    const label = document.createElement("label");
    label.htmlFor = `filter-${neighborhood}`;
    label.textContent = neighborhood;

    container.appendChild(checkbox);
    container.appendChild(label);
    filtersDiv.appendChild(container);
  });
}

// Event handler for filter changes
function handleFilterChange() {
  const checkboxes = document.querySelectorAll("#filters .filter-item input");
  const activeNeighborhoods = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  applyFilter(activeNeighborhoods);
}

// Function to apply the filter to the map layer
function applyFilter(activeNeighborhoods) {
  if (activeNeighborhoods.length === 0) {
    // If no neighborhoods are selected, show none
    map.setFilter("neighborhoods-layer", ["in", "neighborhood", ""]);
  } else {
    // Update the map layer to show only the selected neighborhoods
    map.setFilter("neighborhoods-layer", [
      "in",
      "neighborhood",
      ...activeNeighborhoods,
    ]);
  }

  // Update totals display
  updateTotals(activeNeighborhoods);
}

// Function to update the totals display based on the active neighborhoods
function updateTotals(activeNeighborhoods) {
  // This function should be implemented in totals.js
  // It is called here to update the totals whenever the filter changes
  if (typeof calculateAndUpdateTotals === "function") {
    calculateAndUpdateTotals(activeNeighborhoods);
  }
}

// Fetch the GeoJSON data and initialize the filters
fetch("data.geojson")
  .then((response) => response.json())
  .then((data) => {
    const neighborhoods = getNeighborhoods(data);
    createFilterCheckboxes(neighborhoods);
  })
  .catch((error) => console.error("Error loading GeoJSON data:", error));
