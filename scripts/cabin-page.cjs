// Cabin detail pages: key facts straight under the hero, distinct opening photos
// and a phone-friendly section order. Facts come from data/site-facts.json.
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const facts = require('../data/site-facts.json');
const schedule = require('../data/date-rates.json');
const { imageSize } = require('./layouts.cjs');
const money = n => n.toLocaleString('en-US');
const prefixes = { en: '', ja: 'ja/', 'zh-CN': 'zh-cn/' };
const labels = {
  en: { aria: 'Key facts', price: p => `from ¥${p}`, priceSub: n => `per night, up to ${n} guests · plus ¥${money(facts.pricing.cleaningJPY)} cleaning/stay and taxes`, guests: n => `Up to ${n}`, guestsSub: 'guests · entire cabin',
    wifiSub: 'measured Wi-Fi download, 5 GHz', checkIn: t => t, checkInSub: t => `check-in · out by ${t}`, rates: 'Dated rates and minimum stays →' },
  ja: { aria: '基本情報', price: p => `¥${p}〜`, priceSub: n => `1泊・${n}名まで・清掃料1滞在¥${money(facts.pricing.cleaningJPY)}と税金は別途`, guests: n => `最大${n}名`, guestsSub: '1棟貸切',
    wifiSub: 'Wi-Fi実測値（5 GHz・下り）', checkIn: t => `${t}〜`, checkInSub: t => `チェックイン・アウトは${t}まで`, rates: '日付別料金・最低宿泊数 →' },
  'zh-CN': { aria: '基本信息', price: p => `¥${p}起`, priceSub: n => `每晚·最多${n}位客人·另加每次入住¥${money(facts.pricing.cleaningJPY)}清洁费及税费`, guests: n => `最多${n}人`, guestsSub: '整栋独享',
    wifiSub: 'Wi-Fi实测（5 GHz下载）', checkIn: t => `${t}起`, checkInSub: t => `入住·${t}前退房`, rates: '按日期查看房价及最少入住晚数 →' }
};
function marked(source, name, content, insertAfter) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  const block = `<!-- ${name}:start -->${content}<!-- ${name}:end -->`;
  return pattern.test(source) ? source.replace(pattern, block) : source.replace(insertAfter, m => m + block);
}
function update(source, lang, id) {
  const cabin = facts.cabins.find(c => c.id === id);
  const t = labels[lang];
  const from = Math.min(...schedule.days.map(d => d.rates[id]));
  const wifi = Math.round(facts.wifi.measurements[id]['5'].downloadMbps);
  const items = [
    [t.price(money(from)), t.priceSub(facts.pricing.baseGuests)],
    [t.guests(cabin.maxGuests), t.guestsSub],
    [`${wifi} Mbps`, t.wifiSub],
    [t.checkIn(cabin.checkIn), t.checkInSub(cabin.checkOut)]
  ];
  const strip = `<section class="cabin-facts" aria-label="${t.aria}"><div class="wrap"><ul>${items.map(([value, label]) => `<li><strong>${value}</strong><span>${label}</span></li>`).join('')}</ul><a class="cabin-facts-link" href="/${prefixes[lang]}cabins/#seasonal-rates">${t.rates}</a></div></section>`;
  source = marked(source, 'cabin-facts', strip, /<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>/);

  // The hero, lead image and first gallery tile used to be the same photograph.
  source = source.replace(/<img\b[^>]*class="lead-image"[^>]*>/, tag => {
    const size = imageSize(path.join(root, cabin.leadImage.slice(1)));
    if (!size) throw new Error(`Missing lead image ${cabin.leadImage}`);
    const sizes = tag.match(/\bsizes="([^"]*)"/)?.[1];
    return `<img alt="" class="lead-image" decoding="async" height="${size.height}" src="${cabin.leadImage}" width="${size.width}"${sizes ? ` sizes="${sizes}"` : ''}>`;
  });
  const hero = source.match(/<section\b[^>]*class="page-hero"[^>]*>\s*<img\b[^>]*?\bsrc="([^"]+)"/)?.[1];
  const opening = new Set([hero, cabin.leadImage]);
  source = source.replace(/(<section\b[^>]*class="gallery-section[^"]*"[^>]*>[\s\S]*?<div class="photo-grid">)([\s\S]*?)(<\/div>)/, (_, open, images, close) => {
    const tags = images.match(/<img\b[^>]*>/g) || [];
    const first = tags.filter(tag => !opening.has(tag.match(/\bsrc="([^"]+)"/)?.[1]));
    return open + [...first, ...tags.filter(tag => !first.includes(tag))].join('') + close;
  });

  // Booking facts first; the other cabins and Sapporo sister property close the page.
  let tail = '';
  source = source.replace(/<section\b[^>]*class="other-cabins[^"]*"[^>]*>[\s\S]*?<\/section>(?:\s*<p class="sister-line[^"]*"[^>]*>[\s\S]*?<\/p>)?\s*/, match => { tail = match.trim(); return ''; });
  if (tail) source = source.replace('</main>', tail + '</main>');
  return source;
}
module.exports = { update };
