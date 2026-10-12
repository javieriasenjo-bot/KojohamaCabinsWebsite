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
assert(/script-src[^;]*https:\/\/tracker\.metricool\.com/.test(headers));
console.log('PASS: analytics production-only loading, Metricool hash and load callback, failure isolation and CSP.');
