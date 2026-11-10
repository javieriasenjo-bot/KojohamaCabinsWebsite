// Identity contract for the 10 Nov 2026 website events and the guide feed.
// Canonical ids are the website ids. Older guide ids and the published feed's
// ids collapse onto them. No network and no writes.
'use strict';
const assert = require('node:assert/strict');
const feed = require('./event-feed.cjs');
const localEvents = require('./local-events.cjs');
const data = require('../data/local-events.json');
const canonicalIds = [
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
const guideIdsThatLost = {
  'upopoy-tenpa-tenpa-2026-11-21': 'upopoy-tempa-tempa-2026-11-21',
  'upopoy-ainu-language-asiknep-2026-12-05': 'upopoy-asiknep-2026-12-05',
  'muroran-kiran-matsuri-2026-11-14': 'muroran-kiran-matsuri-2026',
  'muroran-denzai-robot-soccer-2026-11-21': 'muroran-emiran-robot-soccer-2026-11-21',
  'muroran-denzai-christmas-wreath-2026-11-23': 'muroran-emiran-christmas-wreath-2026-11-23',
  'muroran-denzai-fiber-optic-tree-2026-11-29': 'muroran-emiran-fiber-optic-tree-2026-11-29',
  'muroran-small-party-2026-12-06': 'muroran-small-party-vol-2-2026-12-06',
  'toyako-illumination-tunnel-2026': 'toyako-onsen-illumination-2026'
};
const liveIdsThatLost = {
  'onibi-no-michi': 'noboribetsu-onibi-no-michi',
  'toratake-stamp-rally-2026': 'kojohama-takeura-stamp-rally-2026',
  'gering-world-championship-2026': 'shiraoi-gaering-2026-11-15',
  'upopoy-hozonkai-2026-11': 'upopoy-hozonkai-dance-2026-11',
  'upopoy:https://ainu-upopoy.go.jp/event/holiday261121/:2026-11-21': 'upopoy-tempa-tempa-2026-11-21',
  'upopoy:https://ainu-upopoy.go.jp/event/holiday261205/:2026-12-05': 'upopoy-asiknep-2026-12-05'
};
const danceSessions = ['2026-11-21', '2026-11-22', '2026-11-28', '2026-11-29'];
const denzaiIds = [
  'muroran-emiran-robot-soccer-2026-11-21',
  'muroran-emiran-christmas-wreath-2026-11-23',
  'muroran-emiran-fiber-optic-tree-2026-11-29'
];
const stored = data.events.filter(event => canonicalIds.includes(event.id));
assert.deepEqual(stored.map(event => event.id), canonicalIds);
for (const id of Object.keys(guideIdsThatLost).concat(Object.keys(liveIdsThatLost))) {
  assert.equal(data.events.some(event => event.id === id), false, id);
  assert.equal(feed.canonicalId(id), guideIdsThatLost[id] || liveIdsThatLost[id]);
}
const dance = stored.find(event => event.id === 'upopoy-hozonkai-dance-2026-11');
assert.deepEqual(dance.sessions, danceSessions);
assert.deepEqual(feed.occurrenceDates({
  id: 'upopoy-hozonkai-2026-11',
  start: '2026-11-03',
  end: '2026-11-29',
  title: {en: 'Range label'}
}), danceSessions);
assert.equal(feed.occurrenceDates(dance).includes('2026-11-03'), false);
assert.equal(feed.occurrenceDates(dance).includes('2026-11-23'), false);
const denzai = denzaiIds.map(id => stored.find(event => event.id === id));
assert.equal(new Set(denzai.map(event => event.url)).size, 1);
assert.equal(new Set(denzai.map(event => event.id)).size, 3);
const collapsed = feed.dedupeEvents(denzaiIds.map((id, index) => ({
  id: Object.keys(guideIdsThatLost).find(alias => guideIdsThatLost[alias] === id),
  start: denzai[index].start,
  end: denzai[index].end,
  url: denzai[index].url,
  title: {en: 'legacy ' + index}
})).concat(denzai.map(event => ({...event, title: {en: 'canonical ' + event.id}}))));
assert.deepEqual(collapsed.map(event => event.id), denzaiIds);
assert.equal(collapsed.every(event => event.title.en.startsWith('canonical ')), true);

const sourceFeed = {checkedOn: '2026-11-10', events: stored};
const liveAliases = [
  {id: 'toratake-stamp-rally-2026', start: '2026-11-01', end: '2026-12-27', title: {en: 'live rally'}},
  {id: 'gering-world-championship-2026', start: '2026-11-15', end: '2026-11-15', title: {en: 'live gaering'}},
  {id: 'upopoy:https://ainu-upopoy.go.jp/event/holiday261121/:2026-11-21', start: '2026-11-21', end: '2026-11-21', title: {en: 'live tempa'}},
  {id: 'upopoy-hozonkai-2026-11', start: '2026-11-03', end: '2026-11-29', title: {en: 'live range'}},
  {id: 'upopoy:https://ainu-upopoy.go.jp/event/holiday261205/:2026-12-05', start: '2026-12-05', end: '2026-12-05', title: {en: 'live class'}},
  {id: 'onibi-no-michi', start: '2026-01-01', end: '2027-12-31', title: {en: 'live window'}},
  {id: 'year-end-2026', start: '2026-12-28', end: '2027-01-04', title: {en: 'unrelated'}}
];
const stale = feed.mergeFeeds(sourceFeed, {checkedOn: '2026-11-08', events: liveAliases});
assert.equal(stale.checkedOn, '2026-11-10');
for (const id of canonicalIds) assert.equal(stale.events.some(event => event.id === id), true, id);
for (const id of Object.keys(liveIdsThatLost)) assert.equal(stale.events.some(event => event.id === id), false, id);
assert.equal(stale.events.some(event => event.id === 'year-end-2026'), true);
const staleDance = stale.events.find(event => event.id === dance.id);
assert.deepEqual(staleDance.sessions, danceSessions);
assert.equal(staleDance.title.en, dance.title.en);
const staleOnibi = stale.events.find(event => event.id === 'noboribetsu-onibi-no-michi');
assert.equal(staleOnibi.ongoing, true);
assert.equal(staleOnibi.start, undefined);
assert.equal(staleOnibi.end, undefined);
assert.equal(staleOnibi.title.en, stored.find(event => event.id === 'noboribetsu-onibi-no-michi').title.en);
assert.deepEqual(feed.occurrenceDates(staleOnibi), []);

const sameDay = feed.mergeFeeds(sourceFeed, {checkedOn: '2026-11-10', events: liveAliases});
assert.deepEqual(sameDay.events.map(event => event.id).sort(), [
  'kojohama-takeura-stamp-rally-2026',
  'noboribetsu-onibi-no-michi',
  'shiraoi-gaering-2026-11-15',
  'upopoy-asiknep-2026-12-05',
  'upopoy-hozonkai-dance-2026-11',
  'upopoy-tempa-tempa-2026-11-21',
  'year-end-2026'
].sort());
assert.equal(sameDay.events.some(event => denzaiIds.includes(event.id)), false);
const sameOnibi = sameDay.events.find(event => event.id === 'noboribetsu-onibi-no-michi');
assert.equal(sameOnibi.ongoing, true);
assert.equal(sameOnibi.start, undefined);
assert.equal(sameOnibi.end, undefined);
assert.deepEqual(feed.occurrenceDates(sameOnibi), []);
assert.equal(JSON.stringify(sameOnibi).includes('2026-01-01'), false);
assert.equal(JSON.stringify(sameOnibi).includes('2027-12-31'), false);
assert.deepEqual(sameDay.events.find(event => event.id === dance.id).sessions, danceSessions);

const newer = feed.mergeFeeds(sourceFeed, {checkedOn: '2026-11-16', events: [{id: 'onibi-no-michi', start: '2026-01-01', end: '2027-12-31', ongoing: true, title: {en: 'window'}}]});
const newerOnibi = newer.events.find(event => event.id === 'noboribetsu-onibi-no-michi');
assert.equal(newer.events.length, 1);
assert.equal(newerOnibi.ongoing, true);
assert.deepEqual(feed.occurrenceDates(newerOnibi), []);
assert.equal(feed.keepEvent(newerOnibi, '2028-01-15'), true);
assert.equal(feed.keepEvent(newerOnibi, '2099-01-01'), true);
assert.equal(feed.scheduleOk({id: 'noboribetsu-onibi-no-michi', ongoing: true, start: '2026-11-01', end: '2026-11-01'}), false);
assert.equal(feed.scheduleOk(feed.normalizeEvent({id: 'noboribetsu-onibi-no-michi', ongoing: true, start: '2026-11-01', end: '2026-11-01'}).event), true);
assert.deepEqual(feed.occurrenceDates({id: 'onibi-no-michi', start: '2026-01-01', end: '2027-12-31'}), []);

const html = localEvents('en');
const card = html.match(/<article id="noboribetsu-onibi-no-michi"[\s\S]*?<\/article>/)[0];
assert.equal(card.includes('Year-round'), true);
assert.equal(card.includes('data-event-ongoing="true"'), true);
assert.equal(card.includes('data-event-end'), false);
assert.equal(card.includes('<time'), false);
assert.equal(card.includes('2026-11-01'), false);
assert.equal(card.includes('2026-01-01'), false);
assert.equal(card.includes('2027-12-31'), false);
console.log('PASS: event identity contract (12 ids, dance sessions, three DENZAI programs, stale and same-day feeds, year-round Onibi).');
