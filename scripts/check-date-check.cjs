// Offline interaction regression checks. No OTA or analytics request leaves this process.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require(process.env.KOJOHAMA_PLAYWRIGHT_MODULE || 'playwright');
const { render } = require('./date-check.cjs');
const schedule = require('../data/date-rates.json');
const source = fs.readFileSync(require('node:path').join(__dirname, '../seo-site.js'), 'utf8');
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const [, lang, cabin] = req.url.split('/');
  res.end(`<!doctype html><html lang="${lang}"><body>${render(lang, cabin)}<script>${source}</script></body></html>`);
});
let browser;
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch({ headless: true, ...(process.env.KOJOHAMA_CHROME_PATH ? { executablePath: process.env.KOJOHAMA_CHROME_PATH } : {}) });
  const context = await browser.newContext({ timezoneId: 'America/Los_Angeles', viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    const OriginalDate = Date;
    window.Date = class extends OriginalDate {
      constructor(...args) { super(...(args.length ? args : ['2026-10-27T16:00:00Z'])); }
      static now() { return new OriginalDate('2026-10-27T16:00:00Z').getTime(); }
    };
  });
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  let cases = 0;
  for (const lang of ['en', 'ja', 'zh-CN']) for (const cabin of ['sol', 'zen', 'rustic']) {
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/${lang}/${cabin}`);
    const checkin = page.locator('[name=checkin]'), checkout = page.locator('[name=checkout]'), guests = page.locator('[name=guests]');
    const link = page.locator('.date-check a'), result = page.locator('.date-check-result');
    const set = async (arrival, departure, number = '2') => {
      await checkin.fill(arrival); await checkout.fill(departure); await guests.selectOption(number);
      await checkout.dispatchEvent('change');
    };
    const disabled = async () => { assert.equal(await link.getAttribute('href'), null); assert.equal(await link.getAttribute('aria-disabled'), 'true'); };
    await disabled();
    assert.equal(await checkin.getAttribute('min'), '2026-10-28', 'Minimum arrival must use Japan date, not browser date');
    await set('2026-10-27', '2026-10-29'); await disabled();
    await set('2026-12-30', '2026-12-31');
    const first = schedule.days.find(day => day.date === '2026-12-30');
    assert(first.minimumNights[cabin] > 1, 'Regression fixture needs special minimum');
    await disabled();
    await link.dispatchEvent('click');
    assert.equal(await page.evaluate(() => (window.dataLayer || []).filter(item => item.event === 'airbnb_click').length), 0, 'Invalid dates must not count as a booking click');
    assert((await result.innerText()).includes(String(first.minimumNights[cabin])));
    await set('2026-12-30', '2027-01-01', '5');
    let url = new URL(await link.getAttribute('href'));
    assert.equal(url.searchParams.get('adults'), '5');
    assert.equal(url.searchParams.get('check_out'), '2027-01-01');
    const expected = schedule.days.filter(day => day.date >= '2026-12-30' && day.date < '2027-01-01').reduce((n, day) => n + day.rates[cabin], schedule.cleaningJPY + 3 * schedule.extraGuestJPY);
    assert((await result.innerText()).includes(expected.toLocaleString('en-US')));
    await set('2026-12-31', '2026-12-30'); await disabled();
    if (cabin === 'sol') { await set('2026-11-20', '2026-11-21'); await disabled(); }
    await set('2026-11-06', '2026-11-07');
    assert.equal(new URL(await link.getAttribute('href')).searchParams.get('check_out'), '2026-11-07', 'Ordinary weekend permits one night');
    await set('2026-12-24', '2026-12-27', '5');
    const mixed = schedule.days.filter(day => day.date >= '2026-12-24' && day.date < '2026-12-27').reduce((n, day) => n + day.rates[cabin], schedule.cleaningJPY + 3 * schedule.extraGuestJPY);
    assert((await result.innerText()).includes(mixed.toLocaleString('en-US')), 'Mixed rates must be summed night by night; guest supplement is once per stay');
    await set('2028-01-01', '2028-01-02');
    assert.equal(await result.locator('strong').count(), 0, 'Unpublished dates must not invent an estimate');
    assert.equal(new URL(await link.getAttribute('href')).searchParams.get('check_in'), '2028-01-01');
    assert.deepEqual(errors, []); await page.close(); cases++;
  }
  console.log(`PASS: ${cases} cabin/language calculator interactions: Japan date, invalid order, minimum stays, changed dates, five guests, mixed rates and unpublished dates; no external requests.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); server.close(); });
