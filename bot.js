import puppeteer from "puppeteer";

async function runBot() {
  console.log("Iniciando bot...");

  // Leer cookies desde GitHub Secrets
  if (!process.env.COOKIES) {
    console.error("ERROR: No existe el secret COOKIES");
    process.exit(1);
  }

  const cookies = JSON.parse(process.env.COOKIES);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Colocar cookies en la página
  await page.setCookie(...cookies);

  console.log("Cookies cargadas. Navegando al panel...");

  await page.goto("https://panel.freegamehost.xyz/server/bb072ba6", {
    waitUntil: "networkidle2"
  });

  console.log("Página cargada. Buscando botón Renew...");

  try {
    await page.waitForSelector("span.Button___StyledSpan-sc-1qu1gou-2", { timeout: 15000 });
    await page.click("span.Button___StyledSpan-sc-1qu1gou-2");
    console.log("✔ Bot hizo clic en Renew");
  } catch (err) {
    console.error("❌ No se encontró el botón Renew:", err);
  }

  await browser.close();
}

runBot();
