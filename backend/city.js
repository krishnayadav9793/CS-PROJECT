document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const stateName = params.get("state") || "Rajasthan";

  const title = document.getElementById("stateTitle");
  const container = document.getElementById("cityContainer");

  title.innerText = `Top Cities in ${stateName}`;
  container.innerHTML = "<p>Loading cities...</p>";

  try {
    const res = await fetch(`/api/destinations?state=${stateName}`);
    const data = await res.json();

    if (!data.cities || data.cities.length === 0) {
      container.innerHTML = "<p>No cities found for this state.</p>";
      return;
    }

    displayCities(data.cities);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    container.innerHTML = "<p>⚠️ Failed to load data. Please try again later.</p>";
  }
});

function displayCities(cities) {
  const container = document.getElementById("cityContainer");
  container.innerHTML = "";

  cities.forEach(city => {
    const cityDiv = document.createElement("div");
    cityDiv.className = "city-box";

    const attractionsHTML = city.attractions.map(attr => `
      <div class="attraction-card">
        <img src="${attr.image}" alt="${attr.name || 'Attraction Image'}" />
        <h4>${attr.name}</h4>
        <p>${attr.description}</p>
        <a href="${attr.wikipedia}" target="_blank" rel="noopener noreferrer">Read more</a>
      </div>
    `).join("");

    cityDiv.innerHTML = `
      <h2>${city.city}</h2>
      <div class="attractions">
        ${attractionsHTML}
      </div>
    `;

    container.appendChild(cityDiv);
  });

  styleAttractionImages();
}

function styleAttractionImages() {
  document.querySelectorAll('.attraction-card img').forEach(img => {
    img.style.height = "50vh";
    img.style.width = "100%";
    img.style.objectFit = "contain";
    img.style.objectPosition = "center";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    img.style.marginBottom = "10px";
  });
}