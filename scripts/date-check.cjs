// "Check your dates" block for each cabin page: estimated total from the approved
// nightly schedule, then Airbnb opens with dates and guests filled in.
// Hidden without JavaScript; the normal Airbnb buttons remain.
const facts = require('../data/site-facts.json');
const schedule = require('../data/date-rates.json');
const DAY = 86400000;
schedule.days.forEach((d, i) => {
  if (i && Date.parse(d.date) - Date.parse(schedule.days[i - 1].date) !== DAY) throw new Error(`date-rates.json: gap before ${d.date}`);
});
const end = new Date(Date.parse(schedule.days.at(-1).date) + DAY).toISOString().slice(0, 10);
const copy = {
  en: { title: 'Check your dates', intro: 'Choose your dates to see an estimated total. Airbnb then opens with your dates and guests filled in, so you can confirm availability and book.',
    checkin: 'Check-in', checkout: 'Check-out', guests: 'Guests', button: 'Check these dates on Airbnb',
    note: `Estimate from our published nightly rates, plus ¥${schedule.cleaningJPY.toLocaleString('en-US')} cleaning per stay and ¥${schedule.extraGuestJPY.toLocaleString('en-US')} per stay for each guest from the third. Taxes and optional BBQ are extra. Availability and the final total are confirmed on Airbnb.`,
    msg: { pick: 'Choose check-in and check-out dates.', order: 'Check-out must be after check-in.', min: 'Arrivals on {date} need at least {n} nights.',
      outside: 'Rates for these dates are not published yet. Airbnb shows the live price.', result: '{nights} · {guests}: about <strong>¥{total}</strong> before tax',
      breakdown: 'Nightly rates ¥{nightly} + cleaning ¥{cleaning}{extra}', extra: ' + extra guests ¥{extra}', night: ['night', 'nights'], guest: ['guest', 'guests'] } },
  ja: { title: '日程を確認', intro: '日付を選ぶと料金の目安が表示されます。Airbnbは日付と人数が入力された状態で開くので、そのまま空室確認・予約ができます。',
    checkin: 'チェックイン', checkout: 'チェックアウト', guests: '人数', button: 'この日程でAirbnbを確認',
    note: `掲載中の1泊料金に、清掃料金${schedule.cleaningJPY.toLocaleString('en-US')}円／滞在と、3人目以降1名につき${schedule.extraGuestJPY.toLocaleString('en-US')}円／滞在を加えた目安です。税金と任意のBBQは別途。空室と最終金額はAirbnbでご確認ください。`,
    msg: { pick: 'チェックインとチェックアウトの日付を選んでください。', order: 'チェックアウトはチェックインより後の日付にしてください。', min: '{date}到着の場合、最低{n}泊が必要です。',
      outside: 'この日程の料金はまだ掲載していません。最新の料金はAirbnbでご確認ください。', result: '{nights}・{guests}：税別 約<strong>¥{total}</strong>',
      breakdown: '宿泊料金 ¥{nightly} + 清掃料金 ¥{cleaning}{extra}', extra: ' + 追加人数 ¥{extra}', night: ['泊', '泊'], guest: ['名', '名'] } },
  'zh-CN': { title: '查看日期', intro: '选择日期即可查看预估总价。随后打开的Airbnb页面会自动填好日期和人数，方便您确认空房并预订。',
    checkin: '入住', checkout: '退房', guests: '人数', button: '在Airbnb查看这些日期',
    note: `预估价按公布的每晚房价计算，另加每次入住¥${schedule.cleaningJPY.toLocaleString('en-US')}清洁费，以及第3位起每位客人每次入住¥${schedule.extraGuestJPY.toLocaleString('en-US')}；税费和自选BBQ另计。空房及最终总价以Airbnb为准。`,
    msg: { pick: '请选择入住和退房日期。', order: '退房日期须晚于入住日期。', min: '{date}入住须至少住{n}晚。',
      outside: '这些日期的房价尚未公布，最新价格请以Airbnb为准。', result: '{nights}·{guests}：税前约<strong>¥{total}</strong>',
      breakdown: '房费¥{nightly} + 清洁费¥{cleaning}{extra}', extra: ' + 加人费¥{extra}', night: ['晚', '晚'], guest: ['位客人', '位客人'] } }
};
function render(lang, cabinId) {
  const cabin = facts.cabins.find(c => c.id === cabinId), l = copy[lang];
  if (!cabin || !l) throw new Error(`date-check: unknown ${lang}/${cabinId}`);
  const data = { start: schedule.days[0].date, end, rates: schedule.days.map(d => d.rates[cabinId]), min: schedule.days.map(d => d.minimumNights[cabinId]),
    cleaning: schedule.cleaningJPY, extra: schedule.extraGuestJPY, baseGuests: facts.pricing.baseGuests, msg: l.msg };
  const options = Array.from({ length: cabin.maxGuests }, (_, i) => `<option${i + 1 === 2 ? ' selected' : ''}>${i + 1}</option>`).join('');
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<section class="date-check wrap" id="check-dates" hidden><div class="date-check-card"><h2>${l.title}</h2><p>${l.intro}</p>`
    + `<div class="date-check-fields"><label>${l.checkin}<input type="date" name="checkin" min="${data.start}" max="${schedule.days.at(-1).date}"></label>`
    + `<label>${l.checkout}<input type="date" name="checkout" min="${schedule.days[1].date}" max="${end}"></label>`
    + `<label>${l.guests}<select name="guests">${options}</select></label></div>`
    + `<p class="date-check-result" aria-live="polite"></p>`
    + `<a class="button airbnb" data-cabin-name="${cabin.name}" data-link-location="date_check" href="${cabin.airbnb}" rel="noopener" target="_blank">${l.button}</a>`
    + `<p class="note">${l.note}</p><script type="application/json" class="date-check-data">${json}</script></div></section>`;
}
module.exports = { render };
