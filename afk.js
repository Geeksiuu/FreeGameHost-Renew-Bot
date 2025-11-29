const puppeteer = require("puppeteer");
const cookies = require("./cookies.json");

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Cargar cookies en el navegador
  await page.setCookie(...cookies);

  // Ir a página AFK
  await page.goto("https://billing.freeminecrafthost.com/earn/coins", {
    waitUntil: "networkidle2"
  });

  console.log("✅ AFK iniciado...");


  // -------------------------------
  //  FUNCIÓN PARA CERRAR ANUNCIOS
  // -------------------------------
  async function cerrarAnuncios() {
    try {
      // Seletores más comunes de anuncios
      const selectores = [
        ".close",
        ".close-btn",
        ".modal-close",
        ".btn-close",
        "button[aria-label='Close']",
        ".x-button",
      ];

      for (let sel of selectores) {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click().catch(() => {});
          console.log("❌ Anuncio cerrado:", sel);
          return;
        }
      }
    } catch (e) {
      console.log("⚠ No se pudo cerrar anuncio:", e.message);
    }
  }


  // --------------------------------------
  // SIMULAR MOVIMIENTOS/CURSOS Y CLICS
  // --------------------------------------
  async function simularActividadHumana() {
    try {
      const x = Math.floor(Math.random() * 600) + 100; // posición aleatoria
      const y = Math.floor(Math.random() * 400) + 100;

      // Mover el mouse
      await page.mouse.move(x, y);
      console.log("🖱 Moviendo mouse a:", x, y);

      // 50% probabilidad de hacer clic
      if (Math.random() < 0.5) {
        await page.mouse.click(x, y);
        console.log("🖱 Clic simulado.");
      }
    } catch (e) {
      console.log("Error moviendo mouse:", e.message);
    }
  }

  // -----------------------------------------
  // CICLO DE AFK: 50 MINUTOS + CLICS + ANUNCIOS
  // -----------------------------------------
  const tiempo_final = Date.now() + (50 * 60 * 1000); // 50 minutos

  while (Date.now() < tiempo_final) {
    await cerrarAnuncios();
    await simularActividadHumana();

    // Espera entre 30 y 90 segundos antes del próximo clic
    const espera = Math.floor(Math.random() * 60000) + 30000;

    console.log("⏳ Esperando", Math.round(espera / 1000), "segundos...");
    await esperar(espera);
  }

  console.log("⏰ Tiempo AFK terminado, cerrando...");
  await browser.close();
})();
