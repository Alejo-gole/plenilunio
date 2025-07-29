function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function calcularRangoMeses(mesActual) {
  const m = parseInt(mesActual, 10);
  if (isNaN(m)) return [];
  const anterior = m === 1 ? 12 : m - 1;
  return [anterior, m];
}

function obtenerUbicacionActual(callback) {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada por tu navegador.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => callback(pos.coords.latitude, pos.coords.longitude),
    err => {
      console.error("Error al obtener ubicación:", err.message);
      alert("No se pudo acceder a tu ubicación.");
    }
  );
}

// ========== Carga de Datos ==========
let locationData = {};
let cropsData = {};

async function loadData() {
  const locRes = await fetch('/locations.json');
  const cropRes = await fetch('/crops.json');
  if (!locRes.ok || !cropRes.ok) throw new Error("Error cargando JSONs");
  locationData = await locRes.json();
  cropsData = await cropRes.json();
}

// ========== Selects ==========
function setupSelects() {
  const dept = document.getElementById("department-select");
  const city = document.getElementById("city-select");
  const month = document.getElementById("month-select");

  dept.innerHTML = `<option value="">Selecciona un departamento</option>`;
  city.innerHTML = `<option value="">Selecciona una ciudad</option>`;
  city.disabled = true;

  Object.keys(locationData).forEach(dep => {
    const opt = document.createElement("option");
    opt.value = dep;
    opt.textContent = dep;
    dept.appendChild(opt);
  });

  dept.addEventListener("change", () => {
    const selected = dept.value;
    city.disabled = !selected;
    city.innerHTML = `<option value="">Selecciona una ciudad</option>`;
    if (selected && locationData[selected]?.ciudades) {
      locationData[selected].ciudades.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        city.appendChild(opt);
      });
    }
  });

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  month.innerHTML = `<option value="">Selecciona el mes</option>`;
  for (let i = 1; i <= currentMonth; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = months[i - 1];
    month.appendChild(opt);
  }
}

// ========== Lunar info ==========
async function fetchData() {
  try {
    const res = await fetch("/api/v1/daily_rhythm");

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Error ${res.status}: ${errorBody}`);
    }
    const data = await res.json();

    document.getElementById("info").innerHTML = `
      <p><strong>Luna:</strong> ${data.moon.phase} (Iluminación de ${data.moon.illumination}%)</p>
      <p><strong>Sabiduría:</strong> “${data.wisdom}”</p>
    `;
  } catch (err) {
    console.error("Error fetchData:", err);
    document.getElementById("info").innerHTML =
      `<p class="text-red-400">Error al cargar datos: ${err.message}</p>`;
  }
}

// ========== Open-Meteo ==========
async function getEcoCicleAndVars(lat, lon, months) {
  const [prev, cur] = months;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Mes actual (1-12)
  const currentDay = today.getDate();

  const yyyy = today.getFullYear();
  const mm   = String(today.getMonth() + 1).padStart(2, '0');  // mes actual 01–12
  const dd   = String(today.getDate()).padStart(2, '0');       // día actual 01–31
  // Fecha de inicio (hoy)
  const startDateAPI = `${yyyy}-${mm}-${dd}`;
  // Fecha de fin (+16 días)
  const future = new Date(today);
  future.setDate(future.getDate() + 10);
  const yyyy2 = future.getFullYear();
  const mm2   = String(future.getMonth() + 1).padStart(2, '0');
  const dd2   = String(future.getDate()).padStart(2, '0');
  const endDateAPI = `${yyyy2}-${mm2}-${dd2}`;

  // Año del mes anterior
  const yearPrev = cur === 1 ? currentYear - 1 : currentYear;
  const startDate = `${yearPrev}-${String(prev).padStart(2, '0')}-01`;

  // Limitar la fecha final al día actual
  let endYear = currentYear;
  let endMonth = cur;
  let endDay;

  if (cur > currentMonth) {
    // Si el mes seleccionado es futuro, usar el mes actual
    endMonth = currentMonth;
    endDay = currentDay;
  } else if (cur === currentMonth) {
    // Si es el mes actual, usar el día actual
    endDay = currentDay;
  } else {
    // Si es un mes pasado, usar el último día de ese mes
    const lastDayOfMonth = new Date(currentYear, cur, 0).getDate();
    endDay = lastDayOfMonth;
  }

  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  console.log(`Consultando desde ${startDateAPI} hasta ${endDateAPI}`); // Para debug

  const url = `https://api.open-meteo.com/v1/forecast` +
              `?latitude=${lat}&longitude=${lon}` +
              `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min` +
              `&hourly=relative_humidity_2m` +
              `&models=ecmwf_ifs025` +
              `&timezone=GMT` +
              `&start_date=${startDateAPI}` +
              `&end_date=${endDateAPI}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error de API:', errorText);
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();

  const lluvias = data.daily.precipitation_sum || [];
  const humedad = data.hourly.relative_humidity_2m || [];

  if (lluvias.length === 0) {
    throw new Error('No hay datos de precipitación disponibles');
  }

  const lluviaProm = lluvias.reduce((a, b) => a + (b || 0), 0) / lluvias.length;
  const humedadHoy = humedad[humedad.length - 1] || "No disponible";
  const lluviaHoy = lluvias[0] || "No disponible";

  let ciclo = "transición ⛅";
  if (lluviaProm > 8) ciclo = "lluvias intensas 🌧️🌧️🌧️";
  else if (lluviaProm > 5) ciclo = "lluvias 🌧️🌧️";
  else if (lluviaProm < 1) ciclo = "sequía intensa ☀️☀️☀️";
  else if (lluviaProm < 3) ciclo = "sequía ☀️☀️";

  return { 
    ciclo, 
    humedadHoy: humedadHoy !== "No disponible" ? `${humedadHoy.toFixed(1)}` : humedadHoy,
    lluviaHoy: lluviaHoy !== "No disponible" ? `${lluviaHoy.toFixed(1)}` : lluviaHoy,
    promedioPrecipitacion: lluviaProm.toFixed(2)
  };
}

// ========== UI ==========
function mostrarResultado({ ciclo, humedadHoy, lluviaHoy }) {
  const cont = document.getElementById("result-container");
  const eco = document.getElementById("eco-result");
  const loader = document.getElementById("loader");
  loader.classList.add("hidden");
  eco.innerHTML = `
    <strong>Ciclo ecológico:</strong> ${ciclo}<br>
    <strong>Humedad relativa actual:</strong> ${humedadHoy}%<br>
    <strong>Precipitación de hoy:</strong> ${lluviaHoy} mm
  `;
  cont.classList.remove("hidden");
}

// ========== Inicio ==========
window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadData();
    setupSelects();
  } catch (err) {
    alert("Error cargando datos iniciales");
    return;
  }

  const form = document.querySelector("form#location");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dept = document.getElementById("department-select").value;
    const city = document.getElementById("city-select").value;
    const month = parseInt(document.getElementById("month-select").value, 10);
    if (!dept || !city || !month) return alert("Completa todos los campos");

    const coords = locationData?.[dept]?.[city];
    if (!coords) return alert("Ubicación inválida");

    const meses = calcularRangoMeses(month);

    loader.classList.remove("hidden");

    try {
      const result = await getEcoCicleAndVars(coords.lat, coords.lon, meses);
      mostrarResultado(result);
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      loader.classList.add("hidden");
    }
  });

  const btnGeo = document.getElementById("current-location");
  btnGeo.addEventListener("click", () => {
    obtenerUbicacionActual(async (lat, lon) => {
      const monthValue = parseInt(document.getElementById("month-select").value, 10);
      if (!monthValue) {
        alert("Primero seleccioná un mes para contextualizar los datos.");
        return;
      }
      const months = calcularRangoMeses(monthValue);

      loader.classList.remove("hidden");
      try {
        const result = await getEcoCicleAndVars(lat, lon, months);
        mostrarResultado(result);
      } catch (err) {
        alert(`Error: ${err.message}`);
      } finally {
        loader.classList.add("hidden");
      }
    });
  });
});