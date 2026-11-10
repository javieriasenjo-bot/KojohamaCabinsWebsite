'use strict';
// Japan-calendar rules for local events. Session dates stay explicit: nothing
// here turns a start/end pair into extra days or a repeating series.
// community-events.js keeps a copy of these functions; scripts/check-events.cjs
// fails if the two copies drift.

function tokyoDay(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function shiftDay(ymd, days) {
  return tokyoDay(new Date(Date.parse(ymd + 'T00:00:00+09:00') + days * 86400000));
}

function isDay(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00+09:00'));
}

function sessionsOk(event) {
  if (!event || typeof event !== 'object') return false;
  const has = Object.prototype.hasOwnProperty.call(event, 'sessions');
  if (event.ongoing === true) return !has;
  if (!has) return true;
  const days = event.sessions;
  if (!Array.isArray(days) || days.length === 0) return false;
  if (!days.every(isDay)) return false;
  for (let i = 1; i < days.length; i += 1) if (days[i] <= days[i - 1]) return false;
  return days[0] === event.start && days[days.length - 1] === event.end;
}

function sessionDates(event) {
  if (!sessionsOk(event) || !Object.prototype.hasOwnProperty.call(event, 'sessions')) return null;
  return event.sessions;
}

function phase(event, today) {
  const days = sessionDates(event);
  if (days) {
    if (days.includes(today)) return 'now';
    if (days.some(day => day > today)) return 'next';
    return 'over';
  }
  if (event.ongoing === true) return 'now';
  if (event.start <= today && event.end >= today) return 'now';
  if (event.start > today) return 'next';
  return 'over';
}

function keepEvent(event, today) {
  if (!event || event.status === 'cancelled') return false;
  if (event.ongoing === true) return true;
  return isDay(event.end) && event.end >= shiftDay(today, -14);
}

function scheduleOk(event) {
  if (!event || typeof event !== 'object') return false;
  if (event.ongoing === true) return sessionsOk(event) && !isDay(event.start) && !isDay(event.end);
  return isDay(event.start) && isDay(event.end) && event.end >= event.start && sessionsOk(event);
}

function sortKey(event) {
  if (event && event.ongoing === true) return '';
  return typeof event.start === 'string' ? event.start : '';
}

function canonicalId(id) {
  const aliases = {
    'onibi-no-michi': 'noboribetsu-onibi-no-michi',
    'toratake-stamp-rally-2026': 'kojohama-takeura-stamp-rally-2026',
    'gering-world-championship-2026': 'shiraoi-gaering-2026-11-15',
    'upopoy-hozonkai-2026-11': 'upopoy-hozonkai-dance-2026-11',
    'upopoy:https://ainu-upopoy.go.jp/event/holiday261121/:2026-11-21': 'upopoy-tempa-tempa-2026-11-21',
    'upopoy:https://ainu-upopoy.go.jp/event/holiday261205/:2026-12-05': 'upopoy-asiknep-2026-12-05',
    'upopoy-tenpa-tenpa-2026-11-21': 'upopoy-tempa-tempa-2026-11-21',
    'upopoy-ainu-language-asiknep-2026-12-05': 'upopoy-asiknep-2026-12-05',
    'muroran-kiran-matsuri-2026-11-14': 'muroran-kiran-matsuri-2026',
    'muroran-denzai-robot-soccer-2026-11-21': 'muroran-emiran-robot-soccer-2026-11-21',
    'muroran-denzai-christmas-wreath-2026-11-23': 'muroran-emiran-christmas-wreath-2026-11-23',
    'muroran-denzai-fiber-optic-tree-2026-11-29': 'muroran-emiran-fiber-optic-tree-2026-11-29',
    'muroran-small-party-2026-12-06': 'muroran-small-party-vol-2-2026-12-06',
    'toyako-illumination-tunnel-2026': 'toyako-onsen-illumination-2026'
  };
  return Object.prototype.hasOwnProperty.call(aliases, id) ? aliases[id] : id;
}

function normalizeEvent(event) {
  if (!event || typeof event.id !== 'string') return null;
  const fromAlias = canonicalId(event.id) !== event.id;
  const id = canonicalId(event.id);
  if (id === 'noboribetsu-onibi-no-michi') {
    const copy = Object.assign({}, event, {id: id, ongoing: true});
    delete copy.start;
    delete copy.end;
    delete copy.sessions;
    return {event: copy, fromAlias: fromAlias};
  }
  if (id === 'upopoy-hozonkai-dance-2026-11') {
    const sessions = ['2026-11-21', '2026-11-22', '2026-11-28', '2026-11-29'];
    return {
      event: Object.assign({}, event, {id: id, start: sessions[0], end: sessions[sessions.length - 1], sessions: sessions.slice()}),
      fromAlias: fromAlias
    };
  }
  return {event: Object.assign({}, event, {id: id}), fromAlias: fromAlias};
}

function dedupeEvents(events) {
  const chosen = new Map();
  const aliasWon = new Map();
  for (const raw of events || []) {
    const normalized = normalizeEvent(raw);
    if (!normalized) continue;
    const id = normalized.event.id;
    const previousWasAlias = aliasWon.get(id);
    if (!chosen.has(id) || (previousWasAlias && !normalized.fromAlias)) {
      chosen.set(id, normalized.event);
      aliasWon.set(id, normalized.fromAlias);
    }
  }
  return [...chosen.values()];
}

function occurrenceDates(event) {
  const normalized = normalizeEvent(event);
  if (!normalized) return [];
  const item = normalized.event;
  if (item.ongoing === true) return [];
  const days = sessionDates(item);
  if (days) return days.slice();
  if (!isDay(item.start)) return [];
  return item.end === item.start ? [item.start] : [item.start, item.end];
}

function mergeFeeds(sourceFeed, liveFeed) {
  const sourceOk = sourceFeed && Array.isArray(sourceFeed.events);
  const liveOk = liveFeed && Array.isArray(liveFeed.events);
  if (!sourceOk) return liveOk ? {checkedOn: liveFeed.checkedOn, events: dedupeEvents(liveFeed.events)} : liveFeed;
  if (!liveOk) return {checkedOn: sourceFeed.checkedOn, events: dedupeEvents(sourceFeed.events)};
  const sourceOn = typeof sourceFeed.checkedOn === 'string' ? sourceFeed.checkedOn : '';
  const liveOn = typeof liveFeed.checkedOn === 'string' ? liveFeed.checkedOn : '';
  // Same-day or newer live review wins, so a published feed can still update the page.
  // An older or undated live feed must not drop identities that exist only in source.
  // Either way, legacy ids collapse onto the canonical id and a year-round record
  // keeps no factual start or end.
  if (liveOn !== '' && liveOn >= sourceOn) return {checkedOn: liveFeed.checkedOn, events: dedupeEvents(liveFeed.events)};
  const byId = new Map();
  for (const event of liveFeed.events) if (event && typeof event.id === 'string') byId.set(event.id, event);
  for (const event of sourceFeed.events) if (event && typeof event.id === 'string') byId.set(event.id, event);
  return {checkedOn: sourceOn || liveOn, events: dedupeEvents([...byId.values()])};
}

module.exports = {
  tokyoDay, shiftDay, isDay, sessionsOk, sessionDates, phase, keepEvent, scheduleOk, sortKey,
  canonicalId, normalizeEvent, dedupeEvents, occurrenceDates, mergeFeeds
};
