// Daily owner-approved workbook schedule, with 16 October 2026 fee overrides.
const facts = require('../data/site-facts.json');
const schedule = require('../data/date-rates.json');
const money = n => n.toLocaleString('en-US');
const copy = {
 en: '16 October 2026–1 July 2027: nightly rates from ¥13,800 for up to two guests. Cleaning is ¥7,000 per stay, charged separately; taxes are extra. Guests 3–5 add ¥2,500 each per stay, not per night. Ordinary weekends allow one night; selected peak dates require two nights, as shown in the dated table. Optional BBQ is ¥3,500 per stay. Confirm availability and the final total on your booking platform. Dates outside this published schedule require a quote.',
 ja: '2026年10月16日〜2027年7月1日：2名まで1泊13,800円から。清掃料金は1滞在7,000円で別途、税金も別途です。3〜5人目はお一人につき1滞在2,500円追加（1泊ごとではありません）。通常の週末は1泊から、一部の繁忙日は日付別料金表のとおり2泊以上です。任意のBBQは1滞在3,500円。空室と最終総額は予約サイトでご確認ください。掲載期間外の料金はお問い合わせください。',
 'zh-CN': '2026年10月16日至2027年7月1日：两位客人每晚¥13,800起。清洁费每次入住¥7,000，税费另计。第3至第5位客人每人每次入住加收¥2,500，并非每晚收费。普通周末最少1晚，部分旺季日期最少2晚，详见日期表。自选BBQ每次入住¥3,500。空房及最终总价请以预订平台为准。公布日期以外的房价请咨询。'
};
const labels = {
 en: { title:'Nightly rates by date', intro:'16 October 2026–1 July 2027. Open a month to see every published night. Rates are per entire cabin per night for up to two guests, before cleaning and taxes. Dates in a range have identical rates and minimum stays. The minimum shown applies to arrival on that date; it is not an availability calendar.', date:'Night / date range', minimum:'Minimum nights on arrival', example:'Example stay totals before tax', headings:['Cabin','5 Nov 2026 · 1 night · 2 guests','6 Nov 2026 · 1 night · 2 guests','6–7 Nov 2026 · 2 nights · 5 guests'], explanation:'Dated examples include cleaning once per stay (¥7,000). The five-guest example includes ¥7,500 for guests 3–5 once per stay. Taxes and optional BBQ are extra. These are illustrations, not live quotes or availability.', formula:'Total: sum of nightly rates + ¥7,000 cleaning per stay + ¥2,500 per extra guest (guests 3–5) per stay, then applicable taxes and optional BBQ. For stays crossing rate periods, add the price for each night.' },
 ja: { title:'日付別の宿泊料金', intro:'2026年10月16日〜2027年7月1日。月を開くと、掲載期間内の各日の料金を確認できます。各棟1泊・2名までの料金で、清掃料金と税金は別途です。期間表示の各日は同じ料金・最低宿泊数です。最低宿泊数はその日にチェックインする場合の条件です。空室状況を示す表ではありません。', date:'宿泊日・期間', minimum:'到着日の最低泊数', example:'税別の宿泊総額例', headings:['キャビン','2026年11月5日・1泊・2名','2026年11月6日・1泊・2名','2026年11月6〜7日・2泊・5名'], explanation:'各例には1滞在につき清掃料金7,000円を1回含みます。5名の例には3〜5人目の追加料金計7,500円を1滞在につき1回含みます。税金と任意のBBQは別途です。空室・確定見積もりではありません。', formula:'計算方法：各日の宿泊料金の合計＋清掃料金7,000円／滞在＋追加人数（3〜5人目）×2,500円／滞在。別途、税金と任意のBBQ料金がかかります。料金期間をまたぐ場合は、各日の料金を合計します。' },
 'zh-CN': { title:'按日期查看每晚房价', intro:'2026年10月16日至2027年7月1日。展开月份可查看公布期间内每晚的房价。价格为整间小屋每晚最多两位客人，清洁费及税费另计。日期区间内各晚的房价及最少入住晚数相同。最少晚数适用于该日抵达入住，并非空房日历。', date:'住宿日期／区间', minimum:'抵达日最少晚数', example:'税前入住总价示例', headings:['小屋','2026年11月5日·1晚·2人','2026年11月6日·1晚·2人','2026年11月6–7日·2晚·5人'], explanation:'示例均含每次入住一次¥7,000清洁费。5人示例还含第3至第5位客人合计¥7,500的每次入住附加费。税费和自选BBQ另计。示例不是实时房价或空房信息。', formula:'总价：各晚房价之和＋每次入住¥7,000清洁费＋额外人数（第3至第5位）×每次入住¥2,500，另加税费及自选BBQ。跨房价期间的住宿请逐晚相加。' }
};
function stayTotal(cabin, dates, guests) {
 if (!Number.isInteger(guests) || guests < 1 || guests > 5) throw new RangeError('Guests must be 1–5');
 const days=dates.map(date=>{const day=schedule.days.find(d=>d.date===date);if(!day)throw new RangeError('Date outside published schedule');return day;});
 if(!days.length || !facts.cabins.some(c=>c.id===cabin)) throw new RangeError('Cabin and nights required');
 for(let i=1;i<dates.length;i++) if(Date.parse(dates[i])-Date.parse(dates[i-1])!==86400000) throw new RangeError('Nights must be consecutive');
 if(dates.length<days[0].minimumNights[cabin]) throw new RangeError('Arrival minimum stay not met');
 return days.reduce((sum,d)=>sum+d.rates[cabin],0)+schedule.cleaningJPY+Math.max(0,guests-2)*schedule.extraGuestJPY;
}
function stayExamples(lang) {
 const l=labels[lang];
 return `<div class="stay-total-examples" id="stay-total-examples"><h3>${l.example}</h3><p>${l.explanation}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${l.example}"><table><caption class="sr-only">${l.example}</caption><thead><tr>${l.headings.map(t=>`<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${facts.cabins.map(c=>`<tr><th scope="row">${c.name}</th>${[[['2026-11-05'],2],[['2026-11-06'],2],[['2026-11-06','2026-11-07'],5]].map(([dates,guests])=>`<td>¥${money(stayTotal(c.id,dates,guests))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="note">${l.formula}</p></div>`;
}
function table(lang) {
 const l=labels[lang], locale=lang==='en'?'en-GB':lang==='ja'?'ja-JP':'zh-CN';
 const months=[...new Set(schedule.days.map(d=>d.date.slice(0,7)))];
 const calendars=months.map(month=>{
  const days=schedule.days.filter(d=>d.date.startsWith(month)),groups=[];
  for(const day of days){const last=groups.at(-1);if(last && JSON.stringify(last.first.rates)===JSON.stringify(day.rates) && JSON.stringify(last.first.minimumNights)===JSON.stringify(day.minimumNights))last.end=day.date;else groups.push({first:day,end:day.date});}
  const title=new Intl.DateTimeFormat(locale,{year:'numeric',month:'long',timeZone:'UTC'}).format(new Date(month+'-01T00:00:00Z'));
  return `<details class="dated-rate-month"><summary>${title}</summary><div class="comparison-scroll" tabindex="0" role="region" aria-label="${title}"><table><caption class="sr-only">${title}</caption><thead><tr><th scope="col">${l.date}</th>${facts.cabins.map(c=>`<th scope="col">${c.name}</th>`).join('')}<th scope="col">${l.minimum}</th></tr></thead><tbody>${groups.map(({first:d,end})=>`<tr data-rate-start="${d.date}" data-rate-end="${end}"><th scope="row">${d.date}${end!==d.date?' – '+end:''}</th>${facts.cabins.map(c=>`<td>¥${money(d.rates[c.id])}</td>`).join('')}<td>${new Set(Object.values(d.minimumNights)).size===1?d.minimumNights.sol:facts.cabins.map(c=>`${c.name}: ${d.minimumNights[c.id]}`).join(' / ')}</td></tr>`).join('')}</tbody></table></div></details>`;
 }).join('');
 return `<section class="wrap seasonal-rates" id="seasonal-rates"><h2>${l.title}</h2><p>${l.intro}</p>${stayExamples(lang)}${calendars}<p class="note">${copy[lang]}</p></section>`;
}
const comparisonLabels = {
 en: ['Compare the cabins', 'Cabin', 'Maximum guests', 'Sleeping arrangements', 'Interior', '5 GHz Wi-Fi · download / upload', '5 Nov 2026 · 1 night + cleaning · 2 guests, before tax', 'Check dates', 'One double bed + three single beds', 'Bedroom beds + one futon (5 sleeping places)', 'Four beds', 'Bright blue-and-white interior', 'Tatami flooring and kotatsu', 'Wood textures; no tatami or kotatsu', 'Wi-Fi measured by phone on 13 October 2026; speeds vary and are not guaranteed. Starting totals apply to a low-season night within 16 October 2026–1 July 2027; rates vary by date and totals include one ¥7,000 cleaning fee. Taxes and optional BBQ are extra.'],
 ja: ['キャビンを比較', 'キャビン', '最大宿泊人数', '寝具', '室内の特徴', '5 GHz Wi-Fi・下り／上り', '2026年11月5日・1泊＋清掃・2名・税別', '空室を確認', 'ダブルベッド1台＋シングルベッド3台', '寝室のベッド＋布団1組（計5名分）', 'ベッド4台', '明るい青と白のインテリア', '畳とこたつ', '木の風合い。畳・こたつなし', 'Wi-Fiは2026年10月13日にスマートフォンで測定。速度は変動し、保証値ではありません。総額は2026年10月16日〜2027年7月1日の閑散期1泊・2名の例で、清掃料金7,000円を含みます。税金と任意のBBQ料金は別途です。'],
 'zh-CN': ['比较三间小屋', '小屋', '最多入住人数', '床铺安排', '室内特色', '5 GHz Wi-Fi·下载／上传', '2026年11月5日·1晚＋清洁·2人·税前', '查看日期', '1张双人床＋3张单人床', '卧室床铺＋1套日式床垫（共5个床位）', '4张床', '明亮的蓝白色内饰', '榻榻米与日式暖桌', '木质内饰，无榻榻米或暖桌', 'Wi-Fi于2026年10月13日使用手机测量；速度会变化，并非保证值。总价示例适用于2026年10月16日至2027年7月1日期间淡季2位客人入住1晚，含一次¥7,000清洁费。税费和自选BBQ费用另计。']
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
  [l[7], c=>`<a href="${c.airbnb}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">Airbnb</a>${facts.bookingChannels.ctrip && lang==='zh-CN'?` · <a href="${c.ctrip}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">${lang==='zh-CN'?'携程':'Ctrip'}</a>`:''}`]
 ];
 return `<section class="wrap cabin-comparison"><h2>${l[0]}</h2><p class="comparison-hint">${hint}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${l[0]}"><table class="cabin-comparison-table"><caption class="sr-only">${l[0]}</caption><thead><tr><th scope="col">${l[1]}</th>${facts.cabins.map(c=>`<th scope="col"><a href="/${prefix}cabins/ocean-stay-${c.id}/">${c.name}</a></th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${label}</th>${facts.cabins.map((c,i)=>`<td>${value(c,i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="note">${l[14]}</p></section>`;
}
const copyFor = (lang, cabin) => cabin ? copy[lang].replaceAll('13,800', money(facts.pricing.rates[cabin].weekday)) : copy[lang];
// The same approved wording, one sentence per bullet for easier reading on phones.
const listFor = (lang, cabin) => copyFor(lang, cabin).split(lang === 'en' ? /(?<=\.)\s+/ : /(?<=。)/).map(s => s.trim()).filter(Boolean);
// Short schema.org priceRange (Google ignores values of 100+ characters).
const priceRange = () => {
  const nightly = schedule.days.flatMap(day => Object.values(day.rates));
  const yen = n => '¥' + n.toLocaleString('en-US');
  return `${yen(Math.min(...nightly))}–${yen(Math.max(...nightly))}`;
};
module.exports = { copy, copyFor, listFor, table, comparison, stayExamples, stayTotal, priceRange };
