/* Shared live listings: data updates require neither a build nor a GitHub push.
 * The feed changes at most once a week (Sunday cloud run) or when the owner publishes
 * manually, so this polls slowly, pauses in background tabs and refreshes when the
 * visitor returns to the page. Cards are built with textContent only: no innerHTML. */
(() => {
  const section = document.getElementById('local-events');
  if (!section) return;
  const html = document.documentElement.lang;
  const lang = html.startsWith('ja') ? 'ja' : html.startsWith('zh') ? 'zh' : 'en';
  const words = {
    en: ['Local events', 'Dates and times are Japan time. Check the source before visiting.', 'Source announcement', 'Announcements checked: ', 'Finished', 'Happening now', 'Coming up', 'Recently finished'],
    ja: ['地元のイベント', '日時は日本時間です。訪問前に元の告知をご確認ください。', '元の告知を見る', '告知確認日：', '終了', '開催中', 'これから', '終了したイベント'],
    zh: ['本地活动', '日期和时间均为日本时间。出发前请查看原始公告。', '查看原始公告', '公告核对日期：', '已结束', '正在举行', '即将举行', '已结束的活动']
  }[lang];
  const locale = lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-GB';
  const ymd = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const nice = new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'short', day: 'numeric' });
  const shown = value => { const at = Date.parse(value + 'T00:00:00+09:00'); return Number.isFinite(at) ? nice.format(at) : value; };
  const POLL_MS = 600000;
  let saved, timer;

  function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text != null) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function dateLine(event) {
    const line = element('p');
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
  function card(event, finished) {
    const article = element('article');
    article.id = event.id;
    article.dataset.eventEnd = event.end;
    article.append(element('h3', event.title[lang] || event.title.en));
    if (finished) article.append(element('p', words[4], 'event-finished'));
    article.append(dateLine(event), element('p', event.summary[lang] || event.summary.en), element('p', event.venue[lang] || event.venue.en));
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
    const cutoff = ymd(new Date(Date.parse(today + 'T00:00:00+09:00') - 14 * 86400000));
    const events = feed.events
      .filter(e => e.end >= cutoff && e.status !== 'cancelled')
      .sort((a, b) => a.start.localeCompare(b.start));
    // Visitors want what is on now, then what is next. Finished listings stay for two
    // weeks (a guest may be checking what they just missed) but never lead the section.
    const now = events.filter(e => e.start <= today && e.end >= today);
    const next = events.filter(e => e.start > today);
    const over = events.filter(e => e.end < today).reverse();
    section.replaceChildren(
      element('h2', words[0]),
      element('p', words[1]),
      element('p', words[3] + feed.checkedOn),
      ...group(words[5], now, false),
      ...group(words[6], next, false),
      ...group(words[7], over, true)
    );
    section.hidden = !events.length;
  }
  /** Feed unreachable: fall back to the pages built into the HTML, hiding what has ended. */
  function fallback() {
    const today = ymd(new Date());
    const cards = [...section.querySelectorAll('[data-event-end]')];
    for (const item of cards) item.hidden = item.dataset.eventEnd < today;
    section.hidden = !cards.some(item => !item.hidden);
  }
  async function refresh() {
    try {
      const response = await fetch('https://guide.kojohamacabins.jp/api/community-events', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw Error('feed unavailable');
      const feed = await response.json();
      if (!Array.isArray(feed.events)) throw Error('invalid feed');
      saved = feed;
      render(feed);
    } catch {
      if (saved) render(saved); else fallback();
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
