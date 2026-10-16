// Keep the four visible previews aligned with the opening of each photo gallery.
// The sequence shows the setting, beds, kitchen and bathroom before extra details.
const captions = require('../data/gallery-captions.json');
const galleries = require('../data/home-galleries.json');
const responsive = require('../data/responsive-images.json');
const facts = require('../data/site-facts.json');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const solCopy = {
  en: 'Make coffee while the light changes over the water. After a beach walk, leave sandy shoes at the entrance and settle in for a quiet evening.',
  ja: '海に映る光の移ろいを眺めながら、コーヒーを淹れる。海辺の散歩から戻ったら、砂のついた靴は玄関で脱いで、穏やかな夜をお過ごしください。',
  'zh-CN': '看着水面光线变化，煮一杯咖啡。海边散步回来后，请在玄关脱下沾沙的鞋子，安心享受宁静的夜晚。'
};
function update(source, lang) {
  const amount=(facts.pricing.rates.zen.weekday+facts.pricing.cleaningJPY).toLocaleString('en-US');
  const example={en:`Example: Zen, two guests, one Sun–Thu night: ¥${amount} before tax, including cleaning.`,ja:`総額例：Zenに2名で日〜木曜1泊の場合、清掃料金込みで税別¥${amount}。`,'zh-CN':`总价示例：2位客人于周日至周四入住Zen 1晚，含清洁费，税前¥${amount}。`}[lang];
  source=source.replace(/<span class="home-stay-example">[\s\S]*?<\/span>/g,'');
  source=source.replace(/(<h3>[^<]*13,800[^<]*<\/h3><p>)([\s\S]*?)(<\/p>)/,(_,start,text,end)=>`${start}${text.trim()}<span class="home-stay-example"> ${example}</span>${end}`);
  source = source.replace(/(<p\b[^>]*data-i18n="sol_p2"[^>]*>)[\s\S]*?(<\/p>)/, (_, start, end) => start + solCopy[lang] + end);
  for (const cabin of ['sol', 'zen', 'rustic']) {
    const preview = galleries[lang][cabin].images.slice(0,4).map(src => {
      const meta = responsive[src];
      if (!meta || !captions[lang][src]) throw new Error(`Missing gallery image metadata: ${lang} ${src}`);
      return `<div class="g-item"><img src="${src}" alt="${escape(captions[lang][src])}" width="${meta.width}" height="${meta.height}" srcset="${meta.srcset}" sizes="(max-width:700px) calc(100vw - 40px), 480px" data-full-src="${src}" loading="lazy" decoding="async"></div>`;
    }).join('');
    const pattern = new RegExp(`(<p\\b[^>]*data-i18n="${cabin}_p2"[^>]*>[\\s\\S]*?<\\/p>)<div class="gallery">[\\s\\S]*?<\\/div>(?=<button class="gallery-more" data-gallery-open="${cabin}")`);
    if (!pattern.test(source)) throw new Error(`Missing homepage gallery: ${lang} ${cabin}`);
    source = source.replace(pattern, (_, paragraph) => `${paragraph}<div class="gallery">${preview}</div>`);
  }
  return source;
}
module.exports = {update};
