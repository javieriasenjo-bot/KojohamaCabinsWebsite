// Source facts and translations live in data/local-events.json.
const {events, checkedOn} = require('../data/local-events.json');
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports = function localEvents(lang) {
 const key = lang === 'zh-CN' ? 'zh' : lang;
 const copy = {
  en:['Local events','Dates and times are Japan time. Check the linked announcement before visiting.','Source announcement','Announcements checked: '],
  ja:['地元のイベント','日時は日本時間です。訪問前にリンク先の告知をご確認ください。','元の告知を見る','告知確認日：'],
  zh:['本地活动','日期和时间均为日本时间。出发前请查看原始公告。','查看原始公告','公告核对日期：']
 }[key];
 const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const cards = events.filter(e=>e.end>=today).sort((a,b)=>a.start.localeCompare(b.start)).map(e=>`<article id="${esc(e.id)}" data-event-end="${esc(e.end)}"><h3>${esc(e.title[key])}</h3><p><time datetime="${e.start}">${e.start}</time>${e.end !== e.start ? ` – <time datetime="${e.end}">${e.end}</time>` : ''}</p><p>${esc(e.summary[key])}</p><p>${esc(e.venue[key])}</p><a class="text-link" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${copy[2]} →</a></article>`).join('\n');
 return `<section id="local-events" class="section-block wrap"><h2>${copy[0]}</h2><p>${copy[1]}</p><p>${copy[3]}${checkedOn}</p><div class="compact-grid">${cards}</div></section>
<script src="/community-events.js" defer></script>`;
};
