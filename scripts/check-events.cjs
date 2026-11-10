// Read-only checks for the 10 Nov 2026 event source. No network, no HTML writes, no D1.
'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const feed = require('./event-feed.cjs');
const localEvents = require('./local-events.cjs');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/local-events.json'), 'utf8'));
const monitor = JSON.parse(fs.readFileSync(path.join(root, 'data/event-monitor.json'), 'utf8'));
const preservedIds = ['toratake-kanbara-2026-10-24', 'toratake-marukan-2026-10-24', 'toratake-photo-contest-2026'];
const addedIds = [
  'kojohama-takeura-stamp-rally-2026',
  'shiraoi-gaering-2026-11-15',
  'upopoy-tempa-tempa-2026-11-21',
  'upopoy-hozonkai-dance-2026-11',
  'upopoy-asiknep-2026-12-05',
  'noboribetsu-onibi-no-michi',
  'muroran-kiran-matsuri-2026',
  'muroran-emiran-robot-soccer-2026-11-21',
  'muroran-emiran-christmas-wreath-2026-11-23',
  'muroran-emiran-fiber-optic-tree-2026-11-29',
  'muroran-small-party-vol-2-2026-12-06',
  'toyako-onsen-illumination-2026'
];
const asiknep = 'アシ\u31f0ネ\u31f7\u309a';
const parkingUrl = 'https://www.visit-hokkaido.jp/event/detail_11429.html';
const preservedHash = 'fd62ff3404149bcd625dda5a232259172bd734d4745161e9e0eab90866410482';

function dedent(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const rest = lines.slice(1).filter(line => line.trim());
  const cut = rest.length ? Math.min(...rest.map(line => line.match(/^[ ]*/)[0].length)) : 0;
  return [lines[0], ...lines.slice(1).map(line => (line.trim() ? line.slice(cut) : ''))].join('\n').trim();
}
function extractFunction(source, name) {
  const start = source.indexOf('function ' + name + '(');
  assert.notEqual(start, -1, 'missing ' + name);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error('unclosed ' + name);
}
function article(html, id) {
  const match = html.match(new RegExp('<article id="' + id + '"[\\s\\S]*?</article>'));
  assert.ok(match, 'missing article ' + id);
  return match[0];
}
function makeDocument(embed, cards) {
  function make(tag) {
    return {
      tag, id: '', className: '', hidden: false, textContent: '', children: [], dataset: {},
      href: '', target: '', rel: '', dateTime: '',
      append(...items) { for (const item of items) this.children.push(item); },
      replaceChildren(...items) { this.children = []; this.append(...items); }
    };
  }
  const section = make('section');
  section.id = 'local-events';
  section.querySelectorAll = () => {
    const out = [];
    const walk = node => {
      if (!node || typeof node !== 'object') return;
      if (Object.prototype.hasOwnProperty.call(node.dataset || {}, 'eventEnd')) out.push(node);
      for (const child of node.children || []) walk(child);
    };
    for (const child of section.children) walk(child);
    return out;
  };
  if (embed) {
    const script = make('script');
    script.id = 'local-events-source';
    script.textContent = JSON.stringify(embed);
    section.append(script);
  }
  for (const card of cards || []) section.append(card);
  const document = {
    documentElement: {lang: 'en'},
    visibilityState: 'visible',
    addEventListener() {},
    createElement: make,
    getElementById(id) {
      let found = null;
      const walk = node => {
        if (!node || typeof node !== 'object' || found) return;
        if (node.id === id) { found = node; return; }
        for (const child of node.children || []) walk(child);
      };
      walk(section);
      return found;
    }
  };
  return {document, section};
}
function plain(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (typeof node !== 'object') return '';
  if (node.children && node.children.length) return node.children.map(plain).join('');
  return node.textContent || '';
}
function articles(node, out = []) {
  if (node && node.tag === 'article') out.push(node);
  if (node && node.children) for (const child of node.children) if (child && typeof child === 'object') articles(child, out);
  return out;
}
async function boot(embed, fetchImpl, cards) {
  const {document, section} = makeDocument(embed, cards);
  const context = vm.createContext({
    document, fetch: fetchImpl,
    AbortSignal: {timeout() { return undefined; }},
    setInterval() { return 1; }, clearInterval() {}, console
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'community-events.js'), 'utf8'), context, {filename: 'community-events.js'});
  await new Promise(resolve => setImmediate(resolve));
  await new Promise(resolve => setImmediate(resolve));
  return section;
}

assert.equal(data.checkedOn, '2026-11-10');
assert.equal(data.events.length, 15);
assert.deepEqual(data.events.map(event => event.id), preservedIds.concat(addedIds));
assert.equal(crypto.createHash('sha256').update(JSON.stringify(preservedIds.map(id => data.events.find(event => event.id === id)))).digest('hex'), preservedHash);
assert.equal(new Set(data.events.map(event => event.id)).size, data.events.length);
assert.deepEqual(monitor.events.map(event => event.id), addedIds);
assert.equal(monitor.checkedOn, '2026-11-10');
assert.equal(monitor.timeZone, 'Asia/Tokyo');
assert.equal(monitor.expiry.daysAfterEnd, 14);
assert.equal(monitor.recurrence, 'none');
assert.equal(monitor.dedupe.identityKey, 'id');

const browser = fs.readFileSync(path.join(root, 'community-events.js'), 'utf8');
for (const name of ['tokyoDay', 'shiftDay', 'isDay', 'sessionsOk', 'sessionDates', 'phase', 'keepEvent', 'scheduleOk', 'sortKey', 'canonicalId', 'normalizeEvent', 'dedupeEvents', 'occurrenceDates', 'mergeFeeds']) {
  assert.equal(dedent(extractFunction(browser, name)), dedent(feed[name].toString()), name + ' drifted from event-feed.cjs');
}

const byId = Object.fromEntries(data.events.map(event => [event.id, event]));
const monitored = Object.fromEntries(monitor.events.map(event => [event.id, event]));
const langs = ['en', 'ja', 'zh', 'zh-TW'];
const banned = [/EMAIL-ONLY/, /Do not cite/i, /Do not use/i, /20\s?km/i, /spectator/i, /観戦/, /観覧/, /Facebook/, /Instagram/, /not published/i, /offline/i, /upopoy-univ-r8-2/];
for (const id of addedIds) {
  const event = byId[id];
  const spec = monitored[id];
  assert.equal(spec.recurrence, null, id);
  assert.equal(event.recurrence, undefined, id);
  assert.equal(feed.scheduleOk(feed.normalizeEvent(event).event), true, id);
  assert.equal(spec.start, event.start === undefined ? null : event.start);
  assert.equal(spec.end, event.end === undefined ? null : event.end);
  assert.deepEqual(spec.sessions, event.sessions || null);
  assert.equal(spec.ongoing, event.ongoing === true);
  assert.equal(spec.sources[0], event.url);
  assert.match(event.id, /^[\w-]+$/);
  assert.equal(event.category, 'seasonal');
  assert.equal(event.source, 'curated');
  assert.match(event.url, /^https:\/\//);
  for (const lang of langs) {
    for (const field of ['title', 'summary', 'venue']) assert.equal(typeof event[field][lang], 'string');
    const blob = event.title[lang] + '\n' + event.summary[lang] + '\n' + event.venue[lang];
    for (const pattern of banned) assert.equal(pattern.test(blob), false, id + ' ' + lang + ' ' + pattern);
    assert.equal(/車で\d|by car|drive time|车程|車程|latitude|longitude|座標/.test(blob), false, id + ' ' + lang);
  }
}

const dance = byId['upopoy-hozonkai-dance-2026-11'];
assert.deepEqual(dance.sessions, ['2026-11-21', '2026-11-22', '2026-11-28', '2026-11-29']);
assert.equal(dance.sessions.includes('2026-11-03'), false);
assert.equal(dance.sessions.includes('2026-11-23'), false);
assert.equal(/11月3日[〜～-]11月29日|3–29|3-29/.test(dance.summary.ja + dance.summary.en), false);
assert.equal(feed.phase(dance, '2026-11-10'), 'next');
assert.equal(feed.phase(dance, '2026-11-21'), 'now');
assert.equal(feed.phase(dance, '2026-11-23'), 'next');
assert.equal(feed.phase(dance, '2026-11-27'), 'next');
assert.equal(feed.phase(dance, '2026-11-29'), 'now');
assert.equal(feed.phase(dance, '2026-11-30'), 'over');
assert.equal(feed.keepEvent(dance, '2026-12-13'), true);
assert.equal(feed.keepEvent(dance, '2026-12-14'), false);
assert.equal(feed.shiftDay('2026-11-29', 14), '2026-12-13');

const onibi = byId['noboribetsu-onibi-no-michi'];
assert.equal(onibi.ongoing, true);
assert.equal(onibi.start, undefined);
assert.equal(onibi.end, undefined);
assert.equal(onibi.sessions, undefined);
assert.equal(JSON.stringify(onibi).includes('2026-11-01'), false);
assert.equal(JSON.stringify(onibi).includes('2026-01-01'), false);
assert.equal(JSON.stringify(onibi).includes('2027-12-31'), false);
assert.equal(feed.phase(onibi, '2027-06-01'), 'now');
assert.equal(feed.keepEvent(onibi, '2027-06-01'), true);
assert.equal(onibi.summary.en.includes(parkingUrl), true);
assert.equal(onibi.summary.ja.includes('160'), true);
assert.equal(/\d{3,}円/.test(onibi.summary.ja), false);

const gaering = byId['shiraoi-gaering-2026-11-15'];
assert.match(gaering.summary.en, /8 November 2026/);
assert.match(gaering.summary.en, /13 November/);
assert.match(gaering.summary.en, /¥1,000/);
assert.match(gaering.summary.en, /¥500/);
assert.match(gaering.summary.ja, /11月8日/);
assert.match(gaering.summary.ja, /1,000円/);
assert.match(gaering.summary.ja, /500円/);
assert.equal(gaering.title.ja.includes('ゲーリング'), true);
assert.equal(gaering.title.en.includes('Gaering'), true);

const language = byId['upopoy-asiknep-2026-12-05'];
for (const lang of langs) assert.equal(language.title[lang].includes(asiknep), true, lang);
assert.equal(language.title.ja.includes('アシクネプ'), false);
assert.match(language.summary.en, /11:30/);
assert.match(language.summary.en, /14:00/);
assert.match(language.summary.en, /15 places/);

for (const id of ['upopoy-tempa-tempa-2026-11-21', 'upopoy-hozonkai-dance-2026-11', 'muroran-small-party-vol-2-2026-12-06']) {
  assert.equal(monitored[id].times, null, id);
  assert.equal(/\d{1,2}:\d{2}/.test(byId[id].summary.en), false, id);
}
assert.equal(byId['upopoy-tempa-tempa-2026-11-21'].url, 'https://ainu-upopoy.go.jp/calendar/');
assert.equal(JSON.stringify(data).includes('upopoy-univ-r8-2'), false);

const denzai = addedIds.filter(id => id.startsWith('muroran-emiran-'));
assert.equal(denzai.length, 3);
assert.equal(new Set(denzai.map(id => byId[id].url)).size, 1);
assert.deepEqual(monitor.dedupe.sameSourceUrlDoesNotMergeDistinctPrograms, denzai);

const muroran = ['muroran-kiran-matsuri-2026', ...denzai, 'muroran-small-party-vol-2-2026-12-06'];
for (const id of muroran) {
  assert.equal(monitored[id].area, 'Muroran');
  assert.equal(byId[id].venue.ja.includes('室蘭'), true, id);
  assert.equal(byId[id].venue.en.includes('Muroran'), true, id);
  assert.equal(byId[id].venue.ja.includes('洞爺'), false, id);
}
const toyako = byId['toyako-onsen-illumination-2026'];
assert.equal(monitored[toyako.id].area, 'Toyako');
assert.equal(toyako.end, '2027-04-27');
assert.equal(toyako.venue.ja.includes('洞爺湖'), true);
assert.equal(toyako.venue.en.includes('Toyako'), true);
assert.equal(toyako.venue.ja.includes('室蘭') || toyako.venue.en.includes('Muroran'), false);
assert.match(toyako.summary.en, /17:00–22:00/);
assert.match(toyako.summary.en, /18:00–22:00/);
assert.equal(feed.phase(toyako, '2026-12-01'), 'now');
assert.equal(byId['noboribetsu-onibi-no-michi'].venue.en.includes('Noboribetsu'), true);
assert.equal(byId['noboribetsu-onibi-no-michi'].venue.ja.includes('室蘭'), false);
assert.equal(feed.tokyoDay(new Date('2026-11-10T14:59:59Z')), '2026-11-10');
assert.equal(feed.tokyoDay(new Date('2026-11-10T15:00:00Z')), '2026-11-11');

const stale = feed.mergeFeeds(
  {checkedOn: '2026-11-10', events: [{id: 'source-only'}, {id: 'shared', title: 'new'}]},
  {checkedOn: '2026-10-23', events: [{id: 'shared', title: 'old'}, {id: 'live-only'}]}
);
assert.equal(stale.checkedOn, '2026-11-10');
assert.deepEqual(stale.events.map(event => event.id).sort(), ['live-only', 'shared', 'source-only']);
assert.equal(stale.events.find(event => event.id === 'shared').title, 'new');
const currentLive = feed.mergeFeeds(
  {checkedOn: '2026-11-10', events: [{id: 'source-only'}]},
  {checkedOn: '2026-11-16', events: [{id: 'published'}]}
);
assert.deepEqual(currentLive.events.map(event => event.id), ['published']);
const undated = feed.mergeFeeds(
  {checkedOn: '2026-11-10', events: [{id: 'source-only'}]},
  {events: [{id: 'live-only'}]}
);
assert.equal(undated.events.some(event => event.id === 'source-only'), true);

for (const lang of ['en', 'ja', 'zh-CN']) {
  const html = localEvents(lang);
  const danceHtml = article(html, dance.id);
  assert.equal(danceHtml.includes(' – '), false, lang);
  for (const day of dance.sessions) assert.equal(danceHtml.includes('datetime="' + day + '"'), true, day);
  assert.equal(danceHtml.includes('datetime="2026-11-23"'), false);
  assert.equal(danceHtml.includes('datetime="2026-11-03"'), false);
  const onibiHtml = article(html, onibi.id);
  assert.equal(onibiHtml.includes('data-event-ongoing="true"'), true);
  assert.equal(onibiHtml.includes('<time'), false, lang);
  assert.equal(html.includes('2026-11-10'), true);
  assert.equal(html.includes('toratake-kanbara-2026-10-24'), true);
  assert.equal(html.includes('id="toratake-kanbara-2026-10-24"'), false);
  assert.equal(html.includes('upopoy-univ-r8-2'), false);
  assert.equal((html.match(/id="local-events-source"/g) || []).length, 1);
}
const english = localEvents('en');
assert.equal(article(english, onibi.id).includes('Year-round'), true);
assert.equal(article(english, 'muroran-kiran-matsuri-2026').includes(' – '), true);

async function main() {
const sourceFeed = {
  checkedOn: '2026-11-10',
  events: [dance, gaering, onibi, {id: 'shared', start: '2026-11-15', end: '2026-11-15', title: {en: 'Source title'}, summary: {en: 'Source summary'}, venue: {en: 'Shiraoi'}}]
};
const liveStale = {
  checkedOn: '2026-10-23',
  events: [
    {id: 'shared', start: '2026-10-24', end: '2026-10-24', title: {en: 'Old title'}, summary: {en: 'Old'}, venue: {en: 'Old'}},
    {id: 'live-only', start: '2026-12-01', end: '2026-12-01', title: {en: 'Live only'}, summary: {en: 'Live'}, venue: {en: 'Live'}}
  ]
};
const rendered = await boot(sourceFeed, async () => ({ok: true, json: async () => liveStale}));
const renderedIds = articles(rendered).map(item => item.id).sort();
assert.deepEqual(renderedIds, ['live-only', 'noboribetsu-onibi-no-michi', 'shared', 'shiraoi-gaering-2026-11-15', 'upopoy-hozonkai-dance-2026-11']);
const renderedDance = articles(rendered).find(item => item.id === dance.id);
assert.equal(plain(renderedDance).includes(' – '), false);
assert.equal((plain(renderedDance).match(/2026/g) || []).length >= 4, true);
const renderedShared = articles(rendered).find(item => item.id === 'shared');
assert.equal(plain(renderedShared).includes('Source title'), true);
assert.equal(plain(renderedShared).includes('Old title'), false);
const renderedOnibi = articles(rendered).find(item => item.id === onibi.id);
assert.equal(plain(renderedOnibi).includes('Year-round'), true);
assert.equal(renderedOnibi.dataset.eventOngoing, 'true');

const replaced = await boot(sourceFeed, async () => ({ok: true, json: async () => ({checkedOn: '2026-11-16', events: liveStale.events.slice(1)})}));
assert.deepEqual(articles(replaced).map(item => item.id), ['live-only']);

const offline = await boot(sourceFeed, async () => { throw new Error('offline'); });
assert.equal(articles(offline).some(item => item.id === dance.id), true);

const oldCard = {
  tag: 'article', id: 'old-card', dataset: {eventEnd: '2026-10-01'}, hidden: false, children: [], textContent: ''
};
const cardsOnly = await boot(null, async () => { throw new Error('offline'); }, [oldCard]);
assert.equal(oldCard.hidden, true);

if (fs.existsSync(path.join(root, '.git'))) {
  const {execFileSync} = require('node:child_process');
  const status = execFileSync('git', ['status', '--porcelain'], {cwd: root, encoding: 'utf8'}).replace(/\n$/, '').split('\n').filter(Boolean);
  const allowed = new Set([
    'community-events.js',
    'data/event-monitor.json',
    'data/local-events.json',
    'data/sitemap-content.json',
    'ja/things-to-do/index.html',
    'package.json',
    'scripts/check-events.cjs',
    'scripts/event-contract.cjs',
    'scripts/event-feed.cjs',
    'scripts/local-events.cjs',
    'sitemap-zh-cn.xml',
    'sitemap.xml',
    'things-to-do/index.html',
    'zh-cn/things-to-do/index.html'
  ]);
  const eventPages = new Set(['things-to-do/index.html', 'ja/things-to-do/index.html', 'zh-cn/things-to-do/index.html', 'sitemap.xml', 'sitemap-zh-cn.xml', 'data/sitemap-content.json']);
  for (const line of status) {
    const file = line.slice(3);
    assert.equal(allowed.has(file), true, 'unexpected path ' + line);
    if (!eventPages.has(file)) assert.equal(/\.html$|sitemap|rating/i.test(file), false, file);
  }
}

const inventory = addedIds.map(id => {
  const event = byId[id];
  const spec = monitored[id];
  return {
    id,
    titleJa: event.title.ja,
    area: spec.area,
    start: event.start,
    end: event.end,
    sessions: event.sessions || null,
    ongoing: event.ongoing === true,
    times: spec.times,
    recurrence: null,
    phaseOn2026Nov10: feed.phase(event, '2026-11-10'),
    lastVisibleDay: event.ongoing === true ? null : feed.shiftDay(event.end, 14),
    hiddenFrom: event.ongoing === true ? null : feed.shiftDay(event.end, 15),
    sources: spec.sources,
    url: event.url
  };
});
const artifactDir = '/opt/cursor/artifacts';
fs.mkdirSync(artifactDir, {recursive: true});
fs.writeFileSync(path.join(artifactDir, 'event-inventory-2026-11-10.json'), JSON.stringify({
  baseline: '2fcc3cc883deb5aaec4e8b2b60df9eb5650d3983',
  checkedOn: data.checkedOn,
  timeZone: 'Asia/Tokyo',
  identities: inventory.length,
  preservedEventIds: preservedIds,
  expiryDaysAfterEnd: 14,
  recurrence: 'none',
  events: inventory
}, null, 2) + '\n');
require('./event-contract.cjs');
console.log('PASS: 12 added identities, 3 preserved events, session dates, 14-day Japan expiry, stale-feed merge.');
console.log(inventory.map(item => [item.id, item.area, item.sessions || (item.ongoing ? 'ongoing' : item.start + '..' + item.end), item.phaseOn2026Nov10].join(' | ')).join('\n'));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
