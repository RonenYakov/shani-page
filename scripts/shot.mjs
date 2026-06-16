// Screenshot helper — desktop + mobile captures of the dev server via system Edge.
import puppeteer from 'puppeteer-core';

const OUT = 'C:/Users/97254/Desktop/shani-page-main/screenshots';
const URL = 'http://localhost:8080/';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
});

async function shot(name, viewport, opts = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2200));
  if (opts.scrollTo != null) {
    await page.evaluate(y => window.scrollTo(0, y), opts.scrollTo);
    await new Promise(r => setTimeout(r, 1600));
  }
  if (opts.tap) {
    await page.tap(opts.tap).catch(() => page.click(opts.tap));
    await new Promise(r => setTimeout(r, 1000));
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.close();
  console.log('saved', name);
}

const mobile = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

await shot('v7-hero-desktop', { width: 1440, height: 900 });
await shot('v7-hero-mobile', mobile);
await shot('v7-about-mobile', mobile, { scrollTo: 900 });
await shot('v7-sticky-mobile', mobile, { scrollTo: 1600 });
await shot('v7-menu-mobile', mobile, { tap: '.burger' });

await browser.close();
