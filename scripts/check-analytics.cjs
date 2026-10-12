// Test loader isolation without sending requests to Google or Metricool.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'analytics.js'), 'utf8');
for (const hostname of ['localhost', '127.0.0.1', 'preview.example', 'kojohamacabins.jp', 'www.kojohamacabins.jp']) {
  const scripts = [], visits = [];
  const window = { beTracker: { t: details => visits.push(details) } };
  vm.runInNewContext(source, { window, location: { hostname, pathname: '/' }, Date,
    document: { documentElement: { lang: 'en' }, createElement: () => ({}), head: { appendChild: script => scripts.push(script) } } });
  const production = ['kojohamacabins.jp', 'www.kojohamacabins.jp'].includes(hostname);
  assert.equal(scripts.length, production ? 2 : 0, hostname);
  if (production) {
    const tracker = scripts.find(script => script.src === 'https://tracker.metricool.com/resources/be.js');
    assert(tracker && tracker.async);
    assert.equal(visits.length, 0, 'Do not initialise before script load');
    tracker.onload();
    assert.equal(visits.length, 1);
    assert.equal(visits[0].hash, 'ffd44c179566f41dd21d51d09878d58d');
    delete window.beTracker;
    assert.doesNotThrow(() => tracker.onload(), 'Missing tracker must not break the page');
  }
}
const headers = fs.readFileSync(path.join(__dirname, '..', '_headers'), 'utf8');
function replay(destination, age = 0, broken = false) {
  const values = new Map();
  const window = { sessionStorage: {
    setItem: (key, value) => { if (broken) throw Error('blocked'); values.set(key, value); },
    getItem: key => values.get(key), removeItem: key => values.delete(key)
  } };
  const location = { hostname: 'kojohamacabins.jp', origin: 'https://kojohamacabins.jp', pathname: '/go/', search: '' };
  const context = { window, location, Date: { now: () => 1000 }, URL,
    document: { documentElement: { lang: 'en' }, createElement: () => ({}), head: { appendChild() {} } } };
  vm.runInNewContext(source, context);
  assert.equal(window.KojohamaAnalytics.queueNavigationEvent({ destination_url: destination }), !broken);
  location.pathname = '/cabins/';
  context.Date.now = () => 1000 + age;
  vm.runInNewContext(source, context);
  const clicks = window.dataLayer.filter(item => item.event === 'bio_link_click');
  vm.runInNewContext(source, context);
  assert.equal(window.dataLayer.filter(item => item.event === 'bio_link_click').length, clicks.length, 'No replay on refresh');
  assert.equal(values.size, 0, 'Pending data cleared');
  return clicks;
}
const handedOff = replay('https://kojohamacabins.jp/cabins/');
assert.equal(handedOff.length, 1);
assert.equal(handedOff[0].page_path, '/go/', 'Preserve original click context');
assert.equal(replay('https://example.com/cabins/').length, 0);
assert.equal(replay('https://kojohamacabins.jp/faq/').length, 0);
assert.equal(replay('https://kojohamacabins.jp/cabins/', 300001).length, 0);
assert.equal(replay('https://kojohamacabins.jp/cabins/', 0, true).length, 0);
assert(/script-src[^;]*https:\/\/tracker\.metricool\.com/.test(headers));
console.log('PASS: analytics production-only loading, Metricool hash and load callback, failure isolation and CSP.');
