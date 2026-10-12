// Isolated event tests: no browser, network requests or real analytics.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'seo-site.js'), 'utf8');
const start = source.indexOf("  if (document.body.dataset.pageKind === 'link-in-bio')");
const end = source.indexOf("\n  document.querySelectorAll('.menu-toggle')", start);
assert(start > 0 && end > start);
function setup(options = {}) {
  let handler;
  const timers = new Map(), events = [], destinations = [];
  const link = { href: 'https://kojohamacabins.jp/cabins/', target: options.target || '',
    textContent: 'Compare cabins', querySelector: () => null,
    hasAttribute: name => !!options[name], addEventListener: (_, fn) => { handler = fn; } };
  const location = { origin: 'https://kojohamacabins.jp', search: '', assign: url => destinations.push(url) };
  vm.runInNewContext(source.slice(start, end), { URL, URLSearchParams, location,
    document: { body: { dataset: { pageKind: 'link-in-bio' } }, querySelectorAll: selector => selector.includes('data-link-location') ? [link] : [] },
    window: { KojohamaAnalytics: { queueNavigationEvent: details => {
      if (!options.storage) return false;
      events.push({ queued: true, ...details }); return true;
    } } },
    placement: () => 'linkinbio_primary', push: (event, details) => events.push({ event, ...details }),
    setTimeout: (fn, delay) => { timers.set(1, { fn, delay }); return 1; }, clearTimeout: id => timers.delete(id) });
  const click = { button: 0, preventDefault() { this.defaultPrevented = true; }, ...options.click };
  handler(click);
  return { events, destinations, timers, click };
}
const normal = setup();
const stored = setup({ storage: true });
assert.equal(stored.events.length, 1);
assert(stored.events[0].queued);
assert.equal(stored.destinations.length, 1);
assert.equal(stored.timers.size, 0, 'Stored clicks navigate immediately');
assert(normal.click.defaultPrevented);
assert.equal(normal.events.length, 1);
assert.equal(normal.events[0].event, 'bio_link_click');
assert.equal(normal.destinations.length, 0);
const fallback = [...normal.timers.values()][0];
assert.equal(fallback.delay, 600);
normal.events[0].eventCallback();
fallback.fn();
assert.equal(normal.destinations.length, 1, 'callback and fallback must navigate only once');
const blocked = setup();
[...blocked.timers.values()][0].fn();
assert.equal(blocked.destinations.length, 1, 'blocked GTM must not stop navigation');
for (const options of [{ click: { ctrlKey: true } }, { click: { metaKey: true } }, { click: { shiftKey: true } }, { click: { altKey: true } }, { click: { button: 1 } }, { target: '_blank' }, { download: true }, { click: { defaultPrevented: true } }]) {
  const result = setup(options);
  assert.equal(result.timers.size, 0, 'modified or new-tab clicks must stay native');
  assert.equal(result.events.length, 1);
}
console.log('PASS: navigation callback, blocked-GTM fallback, single navigation, modified clicks, new tabs and downloads.');
