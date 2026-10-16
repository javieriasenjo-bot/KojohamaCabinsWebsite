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
 return `<section class="wrap seasonal-rates" id="seasonal-rates"><h2>${l[0]}</h2><p>${l[5]}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${l[0]}"><table><caption class="sr-only">${l[0]}</caption><thead><tr>${l.slice(1,5).map(t=>`<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${facts.cabins.map(c=>{const r=facts.pricing.rates[c.id];return `<tr><th scope="row">${c.name}</th><td>¥${money(r.weekday)}</td><td>¥${money(r.weekend)}</td><td>¥${money(r.holiday)}</td></tr>`}).join('')}</tbody></table></div><p class="note">${copy[lang]}</p>${stayExamples(lang)}</section>`;
}
const exampleLabels = {
 en: ['Example stay totals before tax', 'Cabin', '1 weekday night · 2 guests', 'Fri + Sat · 2 nights · 2 guests', 'Fri + Sat · 2 nights · 5 guests', 'Examples for 1 October–24 December 2026 include the ¥7,000 cleaning fee once per stay. The five-guest example also includes ¥7,500 for guests 3–5 once per stay, not per night. BBQ and taxes are not included. These are illustrations, not live quotes or availability; confirm the final total on the booking platform. Weekday stays have a one-night minimum; weekend and holiday stays have a two-night minimum.', 'How the total is calculated: sum of the nightly rates for your dates + ¥7,000 cleaning per stay + ¥2,500 per additional guest (guests 3–5) per stay, then applicable taxes and any optional BBQ.'],
 ja: ['税別の宿泊総額例', 'キャビン', '平日1泊・2名', '金・土曜2泊・2名', '金・土曜2泊・5名', '2026年10月1日〜12月24日の例です。清掃料金7,000円を1滞在につき1回含みます。5名の例には、3〜5人目の追加料金計7,500円を1滞在につき1回含みます（1泊ごとではありません）。税金とBBQは含みません。空室や確定見積もりではないため、予約サイトの最終総額をご確認ください。平日は1泊から、週末・年末年始は2泊以上です。', '計算方法：各日の宿泊料金の合計＋清掃料金7,000円／滞在＋追加人数（3〜5人目）×2,500円／滞在。別途、税金および希望する場合のBBQ料金がかかります。'],
 'zh-CN': ['税前入住总价示例', '小屋', '平日1晚·2位客人', '周五及周六2晚·2位客人', '周五及周六2晚·5位客人', '以下为2026年10月1日至12月24日的示例，每次入住包含一次¥7,000清洁费。5人示例还包含第3至第5位客人合计¥7,500的每次入住附加费，并非每晚收取。不含税费和BBQ。示例不是实时房价或空房信息，请以预订平台的最终总价为准。平日最少1晚，周末及年末年初最少2晚。', '计算方式：所选日期各晚房价之和＋每次入住¥7,000清洁费＋额外人数（第3至第5位）×每次入住¥2,500，另加适用税费及自选BBQ费用。']
};
function stayExamples(lang) {
 const l = exampleLabels[lang], p = facts.pricing;
 return `<div class="stay-total-examples" id="stay-total-examples"><h3>${l[0]}</h3><p>${l[5]}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${l[0]}"><table><caption class="sr-only">${l[0]}</caption><thead><tr>${l.slice(1,5).map(t=>`<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${facts.cabins.map(c=>{const r=p.rates[c.id], weekend=r.weekend*p.weekendMinimumNights+p.cleaningJPY;return `<tr><th scope="row">${c.name}</th><td>¥${money(r.weekday+p.cleaningJPY)}</td><td>¥${money(weekend)}</td><td>¥${money(weekend+(c.maxGuests-p.baseGuests)*p.extraGuestJPY)}</td></tr>`}).join('')}</tbody></table></div><p class="note">${l[6]}</p></div>`;
}
const comparisonLabels = {
 en: ['Compare the cabins', 'Cabin', 'Maximum guests', 'Sleeping arrangements', 'Interior', '5 GHz Wi-Fi · download / upload', 'Weekday night + cleaning · 2 guests, before tax', 'Check dates', 'One double bed + three single beds', 'Bedroom beds + one futon (5 sleeping places)', 'Four beds', 'Bright blue-and-white interior', 'Tatami flooring and kotatsu', 'Wood textures; no tatami or kotatsu', 'Wi-Fi measured by phone on 13 October 2026; speeds vary and are not guaranteed. Starting totals apply to one Sun–Thu night, 1 October–24 December 2026, and include one ¥7,000 cleaning fee. Taxes and optional BBQ are extra.'],
 ja: ['キャビンを比較', 'キャビン', '最大宿泊人数', '寝具', '室内の特徴', '5 GHz Wi-Fi・下り／上り', '平日1泊＋清掃・2名・税別', '空室を確認', 'ダブルベッド1台＋シングルベッド3台', '寝室のベッド＋布団1組（計5名分）', 'ベッド4台', '明るい青と白のインテリア', '畳とこたつ', '木の風合い。畳・こたつなし', 'Wi-Fiは2026年10月13日にスマートフォンで測定。速度は変動し、保証値ではありません。総額は2026年10月1日〜12月24日の日〜木曜1泊・2名の例で、清掃料金7,000円を含みます。税金と任意のBBQ料金は別途です。'],
 'zh-CN': ['比较三间小屋', '小屋', '最多入住人数', '床铺安排', '室内特色', '5 GHz Wi-Fi·下载／上传', '平日1晚＋清洁·2人·税前', '查看日期', '1张双人床＋3张单人床', '卧室床铺＋1套日式床垫（共5个床位）', '4张床', '明亮的蓝白色内饰', '榻榻米与日式暖桌', '木质内饰，无榻榻米或暖桌', 'Wi-Fi于2026年10月13日使用手机测量；速度会变化，并非保证值。总价示例适用于2026年10月1日至12月24日周日至周四，2位客人入住1晚，含一次¥7,000清洁费。税费和自选BBQ费用另计。']
};
function comparison(lang) {
 const l=comparisonLabels[lang], prefix=lang==='en'?'':lang==='ja'?'ja/':'zh-cn/';
 const hint=lang==='en'?'On smaller screens, scroll sideways to compare all three cabins.':lang==='ja'?'画面が小さい場合は、表を横にスクロールして3棟を比較できます。':'在较小的屏幕上，请横向滑动表格以比较三间小屋。';
 const rows = [
  [l[2], c=>c.maxGuests],
  [l[3], (c,i)=>l[8+i]],
  [l[4], (c,i)=>l[11+i]],
  [l[5], c=>{const w=facts.wifi.measurements[c.id]['5'];return `${w.downloadMbps} / ${w.uploadMbps} Mbps`;}],
  [l[6], c=>`¥${money(facts.pricing.rates[c.id].weekday+facts.pricing.cleaningJPY)}`],
  [l[7], c=>`<a href="${c.airbnb}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">Airbnb</a>${facts.bookingChannels.ctrip?` · <a href="${c.ctrip}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">${lang==='zh-CN'?'携程':'Ctrip'}</a>`:''}`]
 ];
 return `<section class="wrap cabin-comparison"><h2>${l[0]}</h2><p class="comparison-hint">${hint}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${l[0]}"><table class="cabin-comparison-table"><caption class="sr-only">${l[0]}</caption><thead><tr><th scope="col">${l[1]}</th>${facts.cabins.map(c=>`<th scope="col"><a href="/${prefix}cabins/ocean-stay-${c.id}/">${c.name}</a></th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${label}</th>${facts.cabins.map((c,i)=>`<td>${value(c,i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="note">${l[14]}</p></section>`;
}
const copyFor = (lang, cabin) => cabin ? copy[lang].replaceAll('13,800', money(facts.pricing.rates[cabin].weekday)) : copy[lang];
module.exports = { copy, copyFor, table, comparison, stayExamples };
