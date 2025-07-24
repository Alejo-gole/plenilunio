let locationsData = {};

async function loadLocations() {
  const res = await fetch("locations.json");
  locationsData = await res.json();
}

function populateCountries() {
  const sel = document.getElementById("select-country");
  Object.keys(locationsData).forEach(country => {
    const opt = new Option(country, country);
    sel.add(opt);
  });
}

function onCountryChange() {
  const country = this.value;
  const selState = document.getElementById("select-state");
  const selCity = document.getElementById("select-city");
  selState.innerHTML = "";
  selCity.innerHTML = "";
  document.getElementById("btn-fetch-location").disabled = true;

  if (!country) {
    selState.disabled = true;
    selCity.disabled = true;
    selState.add(new Option("– Primero elige país –", ""));
    selCity.add(new Option("– Primero elige estado –", ""));
    return;
  }

  selState.disabled = false;
  Object.keys(locationsData[country]).forEach(state => {
    selState.add(new Option(state, state));
  });
  selCity.disabled = true;
  selCity.add(new Option("– Primero elige estado –", ""));
}

function onStateChange() {
  const country = document.getElementById("select-country").value;
  const state = this.value;
  const selCity = document.getElementById("select-city");
  selCity.innerHTML = "";
  document.getElementById("btn-fetch-location").disabled = true;

  if (!state) {
    selCity.disabled = true;
    selCity.add(new Option("– Primero elige estado –", ""));
    return;
  }

  selCity.disabled = false;
  locationsData[country][state].forEach(city => {
    selCity.add(new Option(city, city));
  });
}

function onCityChange() {
  document.getElementById("btn-fetch-location").disabled = !this.value;
}

function setupButton() {
  const btn = document.getElementById("btn-fetch-location");
  btn.addEventListener("click", () => {
    const city = document.getElementById("select-city").value;
    fetchData(city);
  });
}

async function fetchData(city) {
  const url = new URL("/api/v1/daily_rhythm", window.location.origin);
  url.searchParams.set("city", city);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    document.getElementById("info").innerHTML = `
      <p><strong>Luna:</strong> ${data.moon.phase} (${data.moon.illumination}%)</p>
      <p><strong>Sabiduría:</strong> “${data.wisdom}”</p>
    `;
  } catch (err) {
    console.error("Error fetchData:", err);
    document.getElementById("info").innerHTML =
      `<p class="text-red-400">Error al cargar datos: ${err.message}</p>`;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadLocations();
  populateCountries();
  document.getElementById("select-country").addEventListener("change", onCountryChange);
  document.getElementById("select-state").addEventListener("change", onStateChange);
  document.getElementById("select-city").addEventListener("change", onCityChange);
  setupButton();
});
