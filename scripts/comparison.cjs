// Cabin comparison table. Prices are deliberately absent: guests check rates on the booking platform.
const facts = require('../data/site-facts.json');
const { note } = require('./booking-note.cjs');
const money = n => n.toLocaleString('en-US');
const comparisonLabels = {
 en: ['Compare the cabins', 'Cabin', 'Maximum guests', 'Sleeping arrangements', 'Interior', '5 GHz Wi-Fi · download / upload', '5 Nov 2026 · 1 night + cleaning · 2 guests, before tax', 'Check dates', 'One double bed + three single beds', 'One double bed + three single beds', 'One double bed + three single beds', 'Bright blue-and-white interior', 'Tatami flooring and kotatsu', 'Wood textures; no tatami or kotatsu'],
 ja: ['キャビンを比較', 'キャビン', '最大宿泊人数', '寝具', '室内の特徴', '5 GHz Wi-Fi・下り／上り', '2026年11月5日・1泊＋清掃・2名・税別', '空室を確認', 'ダブルベッド1台＋シングルベッド3台', 'ダブルベッド1台＋シングルベッド3台', 'ダブルベッド1台＋シングルベッド3台', '明るい青と白のインテリア', '畳とこたつ', '木の風合い。畳・こたつなし'],
 'zh-CN': ['比较三间小屋', '小屋', '最多入住人数', '床铺安排', '室内特色', '5 GHz Wi-Fi·下载／上传', '2026年11月5日·1晚＋清洁·2人·税前', '查看日期', '1张双人床＋3张单人床', '1张双人床＋3张单人床', '1张双人床＋3张单人床', '明亮的蓝白色内饰', '榻榻米与日式暖桌', '木质内饰，无榻榻米或暖桌'],
};
function comparison(lang) {
 const l=comparisonLabels[lang], prefix=lang==='en'?'':lang==='ja'?'ja/':'zh-cn/';
 const hint=lang==='en'?'On smaller screens, scroll sideways to compare all three cabins.':lang==='ja'?'画面が小さい場合は、表を横にスクロールして3棟を比較できます。':'在较小的屏幕上，请横向滑动表格以比较三间小屋。';
 const rows = [
  [l[2], c=>c.maxGuests],
  [l[3], (c,i)=>l[8+i]],
  [l[4], (c,i)=>l[11+i]],
  [l[5], c=>{const w=facts.wifi.measurements[c.id]['5'];return `${w.downloadMbps} / ${w.uploadMbps} Mbps`;}],
  [l[7], c=>`<a href="${c.airbnb}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">Airbnb</a>${facts.bookingChannels.ctrip && lang==='zh-CN'?` · <a href="${c.ctrip}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">${lang==='zh-CN'?'携程':'Ctrip'}</a>${c.tripcom?` · <a href="${c.tripcom}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">Trip.com</a>`:''}`:''}`]
 ];
 return `<section class="wrap cabin-comparison"><h2>${l[0]}</h2><p class="comparison-hint">${hint}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${l[0]}"><table class="cabin-comparison-table"><caption class="sr-only">${l[0]}</caption><thead><tr><th scope="col">${l[1]}</th>${facts.cabins.map(c=>`<th scope="col"><a href="/${prefix}cabins/ocean-stay-${c.id}/">${c.name}</a></th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${label}</th>${facts.cabins.map((c,i)=>`<td>${value(c,i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>${note(prefix+'index.html')}</p></section>`;
}
module.exports = { comparison };
