import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
});
const page = await b.newPage();
const fails = [];
page.on('requestfailed', r => fails.push(r.url() + ' ' + r.failure().errorText));
page.on('response', r => { if (r.status() >= 400) fails.push(r.url() + ' ' + r.status()); });
await page.goto('http://localhost:8080/', { waitUntil: 'networkidle2' });
const res = await page.evaluate(async () => {
  await document.fonts.ready;
  const lead = document.querySelector('.sa-lead');
  const cs = lead ? getComputedStyle(lead).fontFamily : 'no .sa-lead';
  const check = document.fonts.check('16px "Noa Shalev"');
  const faces = [...document.fonts].filter(f => f.family.includes('Noa')).map(f => f.family + ':' + f.status);
  return { cs, check, faces };
});
console.log(JSON.stringify({ res, fails }, null, 1));
await b.close();
