// Post-build prerender: snapshots each public route into static HTML so
// crawlers (Google, AI bots) that don't run JS still see the Hebrew content.
// The app still boots with createRoot and replaces the snapshot.
// If no browser is available the step is skipped and the SPA build is untouched.
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import puppeteer from "puppeteer-core";

const DIST = resolve("dist");
const ROUTES = ["/", "/process", "/faq", "/accessibility"];
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".mp4": "video/mp4", ".woff2": "font/woff2", ".woff": "font/woff", ".otf": "font/otf", ".ttf": "font/ttf",
};

async function findBrowser() {
  const local = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  const found = local.find((p) => existsSync(p));
  if (found) return { executablePath: found, args: ["--no-sandbox"] };
  try {
    const { default: chromium } = await import("@sparticuz/chromium");
    return { executablePath: await chromium.executablePath(), args: chromium.args };
  } catch {
    return null;
  }
}

// static server with the SPA fallback, served from the untouched app shell
const shell = join(DIST, "spa.html");
await copyFile(join(DIST, "index.html"), shell);
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(DIST, path);
  try {
    if (!file.startsWith(DIST) || path.endsWith("/")) throw 0;
    const buf = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(await readFile(shell));
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const browserOpts = await findBrowser();
if (!browserOpts) {
  console.warn("prerender: no browser found, skipping (SPA build unchanged)");
  server.close();
  process.exit(0);
}

const browser = await puppeteer.launch({ headless: true, ...browserOpts });
try {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    // block media and third-party calls: only the DOM is needed
    await page.setRequestInterception(true);
    page.on("request", (r) => {
      const t = r.resourceType();
      if (t === "media" || !r.url().startsWith(base)) r.abort();
      else r.continue();
    });
    await page.goto(base + route, { waitUntil: "networkidle0" });
    if (route === "/") await page.waitForSelector("#about, #work", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 500));
    const html = await page.content();
    await page.close();
    const out = route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
    await mkdir(join(out, ".."), { recursive: true });
    await writeFile(out, "<!DOCTYPE html>" + html.replace(/^<!DOCTYPE html>/i, ""));
    console.log(`prerender: ${route} -> ${out.replace(DIST, "dist")}`);
  }
} finally {
  await browser.close();
  server.close();
}
