// Guest-facing accommodation copy; generated alongside the other shared sections.
const facts = require('../data/site-facts.json');
const copy = require('../data/accommodation-content.json');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prefixes = {en:'',ja:'ja/','zh-CN':'zh-cn/'};

function update(source, file, lang) {
  if (file === 'googlefa3fab5b6b918158.html') return source;
  const t = copy[lang], prefix = prefixes[lang];
  // Every existing booking placement follows the same verified property destination.
  source = source.replace(/href="https:\/\/kagamiplanning\.airhost\.co\/[^" ]*"/g, `href="${facts.bookingUrl[lang]}"`);
  if (file === prefix + 'index.html') {
    source = source.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(t.title)}</title>`);
    source = source.replace(/<meta\b[^>]*(?:name="description"|property="og:(?:title|description)")[^>]*>/g, tag => {
      const value = tag.includes('property="og:title"') ? t.title : t.description;
      return tag.replace(/content="[^"]*"/, `content="${escape(value)}"`);
    });
    source = source.replace(/<div class="hero-overlay">[\s\S]*?<\/div>\s*<\/div>/, `<div class="hero-overlay"><p class="eyebrow">${escape(t.place)}</p><h1>${escape(t.heading)}</h1><p>${escape(t.intro)}</p><p class="hero-brand-line">${escape(t.brandLine)}</p><div class="hero-actions"><a class="button button-light" data-link-location="homepage_hero" data-cabin-name="All cabins" href="${facts.bookingUrl[lang]}" target="_blank" rel="noopener">${escape(t.availability)}</a><a class="button button-quiet" href="/${prefix}cabins/">${escape(t.compare)}</a></div></div>`);
    // Keep the established photographs and attribution; route travel planning through our guides.
    source = source.replace(/<a\b[^>]*class="guide-card"[^>]*>[\s\S]*?<\/a>/g, card => {
      const href = card.match(/href="([^"]+)"/)?.[1];
      const key = /kojohama\.net|\/guides\/kojohama-onsen\//.test(href) ? 'onsen' : /kokorono-resort|\/guides\/two-day-shiraoi-itinerary\//.test(href) ? 'itinerary' : /ainu-upopoy|\/guides\/upopoy-from-kojohama\//.test(href) ? 'upopoy' : /noboribetsu-spa|\/guides\/noboribetsu-from-kojohama\//.test(href) ? 'noboribetsu' : null;
      if (!key) return card;
      const guide = t.guides[key];
      let image = card.match(/<img\b[^>]*>/)?.[0] || '';
      if (key === 'itinerary') image = `<img class="guide-image" src="/images/exterior/outside-hero-sunset.webp" alt="${escape(t.coastPhoto)}" width="1600" height="1066" loading="lazy" decoding="async">`;
      return `<a class="guide-card" href="/${prefix}guides/${guide.path}/">${image}<span class="guide-type">${escape(guide.type)}</span><h3>${escape(guide.title)}</h3><p>${escape(guide.description)}</p><span class="guide-link">${escape(t.readGuide)} →</span></a>`;
    });
    if (lang === 'ja') source = source.replaceAll('https://ainu-upopoy.go.jp/en/', 'https://ainu-upopoy.go.jp/');
  }
  if (file === prefix + 'cabins/index.html') {
    source = source.replace(/<article\b[^>]*class="cabin-card"[^>]*>[\s\S]*?<\/article>/g, card => {
      const id = card.match(/\/cabins\/ocean-stay-(sol|zen|rustic)\//)?.[1];
      const cabin = facts.cabins.find(c => c.id === id);
      if (!cabin) throw new Error('Cabin comparison card has no recognized cabin link');
      const label = lang === 'en' ? `${cabin.maxGuests} guests · ${cabin.beds} beds` : lang === 'ja' ? `${cabin.maxGuests} 名 · ${cabin.beds} 台のベッド` : `${cabin.maxGuests}人 · ${cabin.beds}张床`;
      return card.replace(/<p\b[^>]*class="eyebrow"[^>]*>[^<]*<\/p>/, `<p class="eyebrow" data-cabin-facts="${id}">${label}</p>`);
    });
  }
  // A helpful return to accommodation from destination-guide search landings.
  if (file.startsWith(prefix + 'guides/')) {
    const block = `<section class="wrap section-block guide-stay-links" aria-label="${escape(t.planStay)}"><h2>${escape(t.planStay)}</h2><p>${escape(t.guideStay)}</p><div class="action-row"><a class="button" data-link-location="guide_stay" data-cabin-name="All cabins" href="${facts.bookingUrl[lang]}" target="_blank" rel="noopener">${escape(t.availability)}</a><a class="button secondary" href="/${prefix}cabins/">${escape(t.compare)}</a></div></section>`;
    const marked = `<!-- guide-stay:start -->${block}<!-- guide-stay:end -->`;
    source = source.includes('<!-- guide-stay:start -->') ? source.replace(/<!-- guide-stay:start -->[\s\S]*?<!-- guide-stay:end -->/, marked) : source.replace('</main>', marked + '</main>');
  }
  return source;
}
module.exports = {update};
