// Owner-confirmed 9 October rates, confirmed in chat on 12 October 2026.
const facts = require('../data/site-facts.json');
const money = n => n.toLocaleString('en-US');
const copy = {
 en: 'October–24 December 2026: nightly rates from ¥13,800 for up to two guests. Cleaning is ¥7,000 per stay, charged separately; taxes are extra. Guests 3–5 add ¥2,500 each per stay. Sunday–Thursday: minimum one night; Friday–Saturday: minimum two nights. 25 December 2026–3 January 2027: special nightly rates and a two-night minimum. Check the dated rate table and your booking platform’s final total before confirming. Rates after 3 January are not covered by this schedule.',
 ja: '2026年10月〜12月24日は、2名まで1泊13,800円から。清掃料金は1滞在7,000円で別途、税金も別途です。3〜5人目はお一人につき1滞在2,500円追加。日〜木曜は1泊から、金・土曜は2泊以上。2026年12月25日〜2027年1月3日は年末年始料金で2泊以上です。日付別料金表と予約サイトの最終総額をご確認ください。1月4日以降はこの料金表の対象外です。',
 'zh-CN': '2026年10月至12月24日：两位客人每晚¥13,800起。清洁费每次入住¥7,000，另计；税费另计。第3至第5位客人每人每次入住加收¥2,500。周日至周四最少1晚，周五及周六最少2晚。2026年12月25日至2027年1月3日适用年末年初房价，最少2晚。请查看日期房价表，并在预订平台核对最终总价。此房价表不适用于1月4日以后的日期。'
};
const labels = {
 en: ['Nightly rates by date', 'Cabin', 'Sun–Thu', 'Fri–Sat', '25 Dec–3 Jan', 'October–24 December 2026. Rates are per cabin per night for up to two guests, before the separate cleaning fee and taxes.'],
 ja: ['日付別の宿泊料金', 'キャビン', '日〜木曜', '金・土曜', '12月25日〜1月3日', '2026年10月〜12月24日の料金。各棟1泊・2名までの料金で、清掃料金と税金は別途です。'],
 'zh-CN': ['按日期查看每晚房价', '小屋', '周日至周四', '周五及周六', '12月25日至1月3日', '2026年10月至12月24日的房价。每间小屋每晚最多两位客人，清洁费及税费另计。']
};
function table(lang) {
 const l = labels[lang];
 return `<section class="wrap seasonal-rates" id="seasonal-rates"><h2>${l[0]}</h2><p>${l[5]}</p><div class="comparison-scroll"><table><caption class="sr-only">${l[0]}</caption><thead><tr>${l.slice(1,5).map(t=>`<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${facts.cabins.map(c=>{const r=facts.pricing.rates[c.id];return `<tr><th scope="row">${c.name}</th><td>¥${money(r.weekday)}</td><td>¥${money(r.weekend)}</td><td>¥${money(r.holiday)}</td></tr>`}).join('')}</tbody></table></div><p class="note">${copy[lang]}</p></section>`;
}
const copyFor = (lang, cabin) => cabin ? copy[lang].replaceAll('13,800', money(facts.pricing.rates[cabin].weekday)) : copy[lang];
module.exports = { copy, copyFor, table };
