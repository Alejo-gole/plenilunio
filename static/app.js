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

window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});