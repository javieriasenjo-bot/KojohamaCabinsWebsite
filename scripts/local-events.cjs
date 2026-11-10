// Source facts and translations live in data/local-events.json.
// The built HTML mirrors the grouping community-events.js renders from the shared feed,
// so the first paint and the refreshed list have the same shape (no visible reflow).
// Explicit session dates are written one by one. Ongoing listings say so and do not
// invent a closing date. This module returns HTML; it does not write the pages.
const feed = require('./event-feed.cjs');
const {events, checkedOn} = require('../data/local-events.json');
for (const event of events) {
 const normalized = feed.normalizeEvent(event);
 if (!normalized || !feed.scheduleOk(normalized.event)) throw new Error('Invalid event schedule: ' + (event && event.id));
}
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports = function localEvents(lang) {
 const key = lang === 'zh-CN' ? 'zh' : lang;
 const copy = {
  en:['Local events','Dates and times are Japan time. Check the linked announcement before visiting.','Source announcement','Announcements checked: ','Finished','Happening now','Coming up','Recently finished','Year-round'],
  ja:['地元のイベント','日時は日本時間です。訪問前にリンク先の告知をご確認ください。','元の告知を見る','告知確認日：','終了','開催中','これから','終了したイベント','通年'],
  zh:['本地活动','日期和时间均为日本时间。出发前请查看原始公告。','查看原始公告','公告核对日期：','已结束','正在举行','即将举行','已结束的活动','全年']
 }[key];
 const locale = key === 'ja' ? 'ja-JP' : key === 'zh' ? 'zh-CN' : 'en-GB';
 const nice = new Intl.DateTimeFormat(locale, {timeZone:'Asia/Tokyo', year:'numeric', month:'short', day:'numeric'});
 const shown = value => nice.format(Date.parse(value + 'T00:00:00+09:00'));
 const stamp = value => `<time datetime="${esc(value)}">${esc(shown(value))}</time>`;
 const dates = event => {
  const days = feed.sessionDates(event);
  if (days) return days.map(stamp).join(', ');
  if (event.ongoing === true) return esc(copy[8]);
  return stamp(event.start) + (event.end !== event.start ? ` – ${stamp(event.end)}` : '');
 };
 // Use the source's review date so identical input always produces identical HTML.
 // The live feed and fallback filter update the display against the visitor's current date.
 const today = checkedOn;
 const card = (e, finished) => `<article id="${esc(e.id)}"${e.ongoing ? ' data-event-ongoing="true"' : ` data-event-end="${esc(e.end)}"`}><h3>${esc(e.title[key])}</h3>${finished ? `<p class="event-finished">${copy[4]}</p>` : ''}<p>${dates(e)}</p><p>${esc(e.summary[key])}</p><p>${esc(e.venue[key])}</p><a class="text-link" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${copy[2]} →</a></article>`;
 const group = (label, list, finished) => list.length ? `<p class="eyebrow">${label}</p><div class="compact-grid">${list.map(e=>card(e,finished)).join('\n')}</div>` : '';
 const listed = events.filter(e => feed.keepEvent(e, today) && feed.phase(e, today) !== 'over').sort((a,b)=>feed.sortKey(a).localeCompare(feed.sortKey(b)));
 const body = group(copy[5], listed.filter(e => feed.phase(e, today) === 'now'), false)
  + group(copy[6], listed.filter(e => feed.phase(e, today) === 'next'), false);
 const embedded = JSON.stringify({checkedOn, events}).replace(/</g, '\\u003c');
 return `<section id="local-events" class="section-block wrap"><h2>${copy[0]}</h2><p>${copy[1]}</p><p>${copy[3]}${checkedOn}</p><script type="application/json" id="local-events-source">${embedded}</script>${body}</section>
<script src="/community-events.js?v=0" defer></script>`;
};
