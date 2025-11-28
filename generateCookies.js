const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // importante, para que puedas loguearte
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto("https://panel.freegamehost.xyz/auth/login", {
    waitUntil: "networkidle2"
  });

  console.log("➡️ Inicia sesión MANUALMENTE.");
  console.log("➡️ Cuando cargue tu panel, regresa aquí y presiona ENTER.");

  process.stdin.once("data", async () => {
    const cookies = await page.cookies();
    fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
    console.log("✔ cookies.json generado correctamente.");
    await browser.close();
    process.exit(0);
  });
})();
