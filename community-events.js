/* Shared live listings: data updates require neither a build nor a GitHub push. */
(() => {
  const section = document.getElementById('local-events');
  if (!section) return;
  const lang = document.documentElement.lang.startsWith('ja') ? 'ja' : document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const words = { en: ['Local events', 'Dates and times are Japan time. Check the source before visiting.', 'Source announcement', 'Announcements checked: ', 'Expired'], ja: ['地元のイベント', '日時は日本時間です。訪問前に元の告知をご確認ください。', '元の告知を見る', '告知確認日：', '終了'], zh: ['本地活动', '日期和时间均为日本时间。出发前请查看原始公告。', '查看原始公告', '公告核对日期：', '已结束'] }[lang];
  const date = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  let saved;
  function element(tag, text) { const el = document.createElement(tag); if (text != null) el.textContent = text; return el; }
  function render(feed) {
    const today = date(new Date()), cutoff = date(new Date(Date.parse(today + 'T00:00:00+09:00') - 14 * 86400000));
    const events = feed.events.filter(e => e.end >= cutoff && e.status !== 'cancelled').sort((a, b) => a.start.localeCompare(b.start));
    const grid = element('div'); grid.className = 'compact-grid';
    for (const e of events) {
      const card = element('article'); card.id = e.id; card.dataset.eventEnd = e.end;
      card.append(element('h3', e.title[lang] || e.title.en));
      if (e.end < today) card.append(element('p', words[4]));
      card.append(element('p', e.start + (e.end !== e.start ? ' – ' + e.end : '')), element('p', e.summary[lang] || e.summary.en), element('p', e.venue[lang] || e.venue.en));
      if (e.url && /^https:\/\//.test(e.url)) { const link = element('a', words[2] + ' →'); link.href = e.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'text-link'; card.append(link); }
      grid.append(card);
    }
    section.replaceChildren(element('h2', words[0]), element('p', words[1]), element('p', words[3] + feed.checkedOn), grid);
    section.hidden = !events.length;
  }
  async function refresh() {
    try { const response = await fetch('https://guide.kojohamacabins.jp/api/community-events', { cache: 'no-store', signal: AbortSignal.timeout(10000) }); if (!response.ok) throw Error('feed unavailable'); const feed = await response.json(); if (!Array.isArray(feed.events)) throw Error('invalid feed'); saved = feed; render(feed); }
    catch { if (saved) render(saved); else { const today = date(new Date()); section.querySelectorAll('[data-event-end]').forEach(card => { card.hidden = card.dataset.eventEnd < today; }); } }
  }
  void refresh(); setInterval(refresh, 60000);
})();
