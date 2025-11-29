const puppeteer = require("puppeteer");
const cookies = require("./cookies.json");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Cargar cookies
  await page.setCookie(...cookies);

  // Ir a la página AFK
  await page.goto("https://billing.freeminecrafthost.com/earn/coins", {
    waitUntil: "networkidle2"
  });

  console.log("✅ AFK iniciado...");

  // Mantener 50 minutos AFK
  await new Promise(resolve => setTimeout(resolve, 50 * 60 * 1000));

  console.log("⏰ 50 minutos terminados, cerrando navegador...");
  await browser.close();
})();
