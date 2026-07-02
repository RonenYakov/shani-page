// Screenshot harness — desktop + mobile captures of the dev server via system Edge.
// Usage: node scripts/shot.mjs [prefix]   (prefix defaults to "shot"; e.g. "baseline", "phase1")
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const OUT = 'C:/Users/97254/Desktop/shani-page-main/screenshots';
const BASE = 'http://localhost:8080';
const PREFIX = process.argv[2] || 'shot';

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
});

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

async function shot(name, route, viewport, opts = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (opts.reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2200));
  if (opts.scrollTo != null) {
    await page.evaluate(y => window.scrollTo(0, y), opts.scrollTo);
    await new Promise(r => setTimeout(r, 1600));
  }
  if (opts.hover) {
    await page.hover(opts.hover).catch(() => {});
    await new Promise(r => setTimeout(r, 900));
  }
  if (opts.tap) {
    await page.tap(opts.tap).catch(() => page.click(opts.tap));
    await new Promise(r => setTimeout(r, 1000));
  }
  await page.screenshot({ path: `${OUT}/${PREFIX}-${name}.png` });
  await page.close();
  console.log('saved', `${PREFIX}-${name}`);
}

// ---- Main page ----
await shot('home-hero-desktop', '/', desktop);
await shot('home-about-desktop', '/', desktop, { scrollTo: 1400 });
await shot('home-work-desktop', '/', desktop, { scrollTo: 2600 });
await shot('home-results-desktop', '/', desktop, { scrollTo: 4400 });
await shot('home-testimonials-desktop', '/', desktop, { scrollTo: 6200 });
await shot('home-contact-desktop', '/', desktop, { scrollTo: 99999 });

await shot('home-hero-mobile', '/', mobile);
await shot('home-about-mobile', '/', mobile, { scrollTo: 900 });
await shot('home-work-mobile', '/', mobile, { scrollTo: 2000 });
await shot('home-results-mobile', '/', mobile, { scrollTo: 3400 });
await shot('home-testimonials-mobile', '/', mobile, { scrollTo: 5200 });
await shot('home-contact-mobile', '/', mobile, { scrollTo: 99999 });
await shot('home-menu-mobile', '/', mobile, { tap: '.burger' });

// ---- Hover states (desktop) ----
await shot('hover-work-card-desktop', '/', desktop, { scrollTo: 2600, hover: '.wg-cat' });
await shot('hover-hero-cta-desktop', '/', desktop, { hover: '.cta' });

// ---- Reduced motion ----
await shot('rm-home-hero-desktop', '/', desktop, { reducedMotion: true });
await shot('rm-home-about-desktop', '/', desktop, { reducedMotion: true, scrollTo: 1400 });
await shot('rm-home-results-desktop', '/', desktop, { reducedMotion: true, scrollTo: 4400 });

// ---- Sub-pages ----
await shot('process-desktop', '/process', desktop);
await shot('process-mid-desktop', '/process', desktop, { scrollTo: 1200 });
await shot('process-mobile', '/process', mobile);
await shot('faq-desktop', '/faq', desktop);
await shot('faq-mobile', '/faq', mobile);

await browser.close();
