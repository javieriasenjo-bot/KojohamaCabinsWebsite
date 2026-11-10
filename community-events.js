/* Shared live listings: data updates require neither a build nor a GitHub push.
 * The feed changes at most once a week (Sunday cloud run) or when the owner publishes
 * manually, so this polls slowly, pauses in background tabs and refreshes when the
 * visitor returns to the page. Cards are built with textContent only: no innerHTML.
 * GET https://guide.kojohamacabins.jp/api/community-events is read-only.
 * If the page embeds a newer source snapshot (#local-events-source), a live feed
 * with an older or missing checkedOn must not replace it. An equal or newer live
 * checkedOn still replaces the section. Explicit session dates are not a daily range,
 * and an ongoing listing does not expire after 14 days. */
(() => {
  const section = document.getElementById('local-events');
  if (!section) return;
  const html = document.documentElement.lang;
  const lang = html.startsWith('ja') ? 'ja' : html.startsWith('zh') ? 'zh' : 'en';
  const words = {
    en: ['Local events', 'Dates and times are Japan time. Check the source before visiting.', 'Source announcement', 'Announcements checked: ', 'Finished', 'Happening now', 'Coming up', 'Recently finished', 'Year-round'],
    ja: ['地元のイベント', '日時は日本時間です。訪問前に元の告知をご確認ください。', '元の告知を見る', '告知確認日：', '終了', '開催中', 'これから', '終了したイベント', '通年'],
    zh: ['本地活动', '日期和时间均为日本时间。出发前请查看原始公告。', '查看原始公告', '公告核对日期：', '已结束', '正在举行', '即将举行', '已结束的活动', '全年']
  }[lang];
  const locale = lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-GB';
  const ymd = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const nice = new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'short', day: 'numeric' });
  const shown = value => { const at = Date.parse(value + 'T00:00:00+09:00'); return Number.isFinite(at) ? nice.format(at) : value; };
  const POLL_MS = 600000;
  let saved, timer;

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

  function readEmbedded() {
    const node = document.getElementById('local-events-source');
    if (!node || typeof node.textContent !== 'string') return null;
    try {
      const feed = JSON.parse(node.textContent);
      return feed && Array.isArray(feed.events) ? feed : null;
    } catch {
      return null;
    }
  }
  const sourceFeed = readEmbedded();

  function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text != null) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function dateLine(event) {
    const line = element('p');
    const days = sessionDates(event);
    if (days) {
      days.forEach((day, index) => {
        if (index) line.append(', ');
        const time = element('time', shown(day));
        time.dateTime = day;
        line.append(time);
      });
      return line;
    }
    if (event.ongoing === true) {
      line.append(words[8]);
      return line;
    }
    const from = element('time', shown(event.start));
    from.dateTime = event.start;
    line.append(from);
    if (event.end !== event.start) {
      const to = element('time', shown(event.end));
      to.dateTime = event.end;
      line.append(' – ', to);
    }
    return line;
  }
  const hasText = value => typeof value === 'string' && value.trim() !== '';
  // Every language falls back to English, so English text is the minimum a card needs.
  const hasCopy = field => field && typeof field === 'object' && (hasText(field[lang]) || hasText(field.en));
  const pick = field => (hasText(field[lang]) ? field[lang] : field.en);
  /** One malformed record must never break the section: skip it instead. */
  function valid(event) {
    return Boolean(event) && typeof event === 'object'
      && typeof event.id === 'string' && /^[\w-]+$/.test(event.id)
      && scheduleOk(event)
      && hasCopy(event.title) && hasCopy(event.summary) && hasCopy(event.venue);
  }
  function card(event, finished) {
    const article = element('article');
    article.id = event.id;
    if (event.ongoing === true) article.dataset.eventOngoing = 'true';
    else article.dataset.eventEnd = event.end;
    article.append(element('h3', pick(event.title)));
    if (finished) article.append(element('p', words[4], 'event-finished'));
    article.append(dateLine(event), element('p', pick(event.summary)), element('p', pick(event.venue)));
    if (event.url && /^https:\/\//.test(event.url)) {
      const link = element('a', words[2] + ' →', 'text-link');
      link.href = event.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      article.append(link);
    }
    return article;
  }
  function group(label, events, finished) {
    if (!events.length) return [];
    const grid = element('div', null, 'compact-grid');
    for (const event of events) grid.append(card(event, finished));
    return [element('p', label, 'eyebrow'), grid];
  }
  function render(feed) {
    const today = ymd(new Date());
    const events = dedupeEvents(feed.events)
      .filter(valid)
      .filter(event => keepEvent(event, today))
      .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
    // Visitors want what is on now, then what is next. A multi-date listing is "now"
    // only on a listed session, including the gaps between those dates.
    // Finished listings stay for two weeks but never lead the section.
    // Ongoing listings stay while the feed still carries them.
    const now = events.filter(event => phase(event, today) === 'now');
    const next = events.filter(event => phase(event, today) === 'next');
    const over = events.filter(event => phase(event, today) === 'over').reverse();
    section.replaceChildren(
      element('h2', words[0]),
      element('p', words[1]),
      element('p', words[3] + (hasText(feed.checkedOn) ? feed.checkedOn : '')),
      ...group(words[5], now, false),
      ...group(words[6], next, false),
      ...group(words[7], over, true)
    );
    section.hidden = !events.length;
  }
  /** Feed unreachable: use the embedded source snapshot, else the cards built into the HTML. */
  function fallback() {
    const today = ymd(new Date());
    const cards = [...section.querySelectorAll('[data-event-end], [data-event-ongoing]')];
    for (const item of cards) item.hidden = item.dataset.eventOngoing !== 'true' && item.dataset.eventEnd < today;
    section.hidden = !cards.some(item => !item.hidden);
  }
  async function refresh() {
    try {
      const response = await fetch('https://guide.kojohamacabins.jp/api/community-events', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw Error('feed unavailable');
      const live = await response.json();
      if (!Array.isArray(live.events)) throw Error('invalid feed');
      const feed = mergeFeeds(sourceFeed, live);
      render(feed);
      saved = feed;
    } catch {
      // A bad feed must leave the page usable: keep the last good render, else source, else the built-in cards.
      try { if (saved) render(saved); else if (sourceFeed) render(sourceFeed); else fallback(); } catch { try { fallback(); } catch { /* leave the section as built */ } }
    }
  }
  function schedule() {
    clearInterval(timer);
    if (document.visibilityState === 'visible') timer = setInterval(refresh, POLL_MS);
  }
  document.addEventListener('visibilitychange', () => {
    schedule();
    if (document.visibilityState === 'visible') void refresh();
  });
  void refresh();
  schedule();
})();
