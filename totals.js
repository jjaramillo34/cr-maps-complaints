// totals.js

// Function to calculate and update the totals display based on the active neighborhoods
function calculateAndUpdateTotals(activeNeighborhoods) {
  // Fetch the GeoJSON data to calculate totals
  fetch("data.geojson")
    .then((response) => response.json())
    .then((data) => {
      // Calculate the total number of complaints for the active neighborhoods
      const totalComplaints = data.features
        .filter((feature) =>
          activeNeighborhoods.includes(feature.properties.Name)
        )
        .reduce((sum, feature) => sum + feature.properties.complaints, 0);

      // Update the totals display element with the calculated total
      const totalsDisplay = document.getElementById("totals-display");
      if (totalsDisplay) {
        totalsDisplay.textContent = `Total Complaints: ${totalComplaints}`;
      }
    })
    .catch((error) => console.error("Error calculating totals:", error));
}

// This function is called from filters.js when the filter changes
// It is exposed globally so it can be called from other scripts
window.calculateAndUpdateTotals = calculateAndUpdateTotals;
