// Practical cabin comparison, generated from the approved facts. No nightly prices.
const facts = require('../data/site-facts.json');
const captions = require('../data/gallery-captions.json');
const images = require('../data/responsive-images.json');
const {note, bookingUrl, cta} = require('./booking-note.cjs');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {
 en: {title:'Compare the cabins',cabin:'Cabin',hint:'On smaller screens, scroll sideways to compare all three cabins.',guests:'Maximum guests',beds:'Beds',sleep:'Sleeping arrangements',bedText:'One double bed + three single beds',interior:'Interior',styles:['Bright blue-and-white interior','Tatami flooring and seasonal kotatsu','Wood textures; no tatami or kotatsu'],parking:'Free parking',parkingText:'One space per cabin',arrival:'Check-in / checkout',dates:'Check availability',photos:'See the sleeping layouts',bathroom:'Bathroom photo',layout:'Sleeping layout',detail:'Cabin details',wifi:'See measured Wi-Fi speeds',onsen:'Nearby day-use onsen',onsenText:'Plan a visit to a local hot spring. Admission is separate from your cabin stay.'},
 ja: {title:'キャビンを比較',cabin:'キャビン',hint:'画面が小さい場合は、表を横にスクロールして3棟を比較できます。',guests:'最大宿泊人数',beds:'ベッド数',sleep:'寝具',bedText:'ダブルベッド1台＋シングルベッド3台',interior:'室内の特徴',styles:['明るい青と白のインテリア','畳と季節のこたつ','木の風合い。畳・こたつなし'],parking:'無料駐車場',parkingText:'各棟1台分',arrival:'チェックイン／チェックアウト',dates:'空室を確認',photos:'寝具の配置を写真で確認',bathroom:'浴室の写真',layout:'寝具の配置',detail:'キャビンの詳細',wifi:'Wi-Fi実測値を見る',onsen:'近くの日帰り温泉',onsenText:'滞在中に立ち寄れる周辺の温泉をご紹介。入浴料は宿泊料とは別途必要です。'},
 'zh-CN': {title:'比较三间小屋',cabin:'小屋',hint:'在较小的屏幕上，请横向滑动表格以比较三间小屋。',guests:'最多入住人数',beds:'床数',sleep:'床铺安排',bedText:'1张双人床＋3张单人床',interior:'室内特色',styles:['明亮的蓝白色内饰','榻榻米与季节性暖桌','木质内饰，无榻榻米或暖桌'],parking:'免费停车',parkingText:'每栋1个车位',arrival:'入住／退房',dates:'查看空房',photos:'查看床铺布局照片',bathroom:'浴室照片',layout:'床铺布局',detail:'小屋详情',wifi:'查看Wi-Fi实测数据',onsen:'附近的日归温泉',onsenText:'规划入住期间的温泉之旅。温泉入场费不包含在小屋住宿费中。'}
};
function comparison(lang) {
 const t=labels[lang],prefix=lang==='en'?'':lang==='ja'?'ja/':'zh-cn/';
 const rows=[[t.guests,c=>c.maxGuests],[t.beds,c=>c.beds],[t.sleep,()=>t.bedText],[t.interior,(c,i)=>t.styles[i]],[t.parking,()=>t.parkingText],[t.arrival,c=>`${c.checkIn} / ${c.checkOut}`]];
 const table=`<section class="wrap cabin-comparison"><h2>${t.title}</h2><p class="comparison-hint">${t.hint}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${t.title}"><table class="cabin-comparison-table"><caption class="sr-only">${t.title}</caption><thead><tr><th scope="col">${t.cabin}</th>${facts.cabins.map(c=>`<th scope="col"><a href="/${prefix}cabins/ocean-stay-${c.id}/">${c.name}</a></th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${label}</th>${facts.cabins.map((c,i)=>`<td>${value(c,i)}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">${t.dates}</th><td colspan="3"><a href="${bookingUrl(lang)}" target="_blank" rel="noopener" data-cabin-name="All cabins" data-link-location="comparison">${cta[lang]}</a></td></tr></tbody></table></div><p>${note(prefix+'index.html')}</p><p><a href="#wifi-measurements">${t.wifi} →</a></p></section>`;
 const photos=facts.cabins.map(c=>{
  const src=`/images/${c.id}/${c.id}-sleeping-layout.webp`,meta=images[src];
  if(!meta||!captions[lang][src])throw new Error(`Missing sleeping photo: ${lang} ${src}`);
  return `<article><h3>${c.name}</h3><a href="${src}" aria-label="${c.name} · ${t.layout}"><img src="${src}" alt="${escape(captions[lang][src])}" width="${meta.width}" height="${meta.height}" loading="lazy" decoding="async"></a><p>${t.bedText}</p><p><a href="/images/${c.id}/${c.id}-bathroom.webp">${t.bathroom}</a> · <a href="/${prefix}cabins/ocean-stay-${c.id}/">${t.detail}</a></p></article>`;
 }).join('');
 return table+`<section class="wrap section-block comparison-photos"><h2>${t.photos}</h2><div class="comparison-photo-grid">${photos}</div><h3>${t.onsen}</h3><p>${t.onsenText} <a href="/${prefix}guides/kojohama-onsen/">${t.onsen} →</a></p></section>`;
}
module.exports={comparison};
