const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const layouts = JSON.parse(fs.readFileSync(path.join(root, 'data/layouts.json'), 'utf8'));
const crypto = require('node:crypto');
const prefixes = {en:'', ja:'ja/', 'zh-CN':'zh-cn/'};
// Shared CSS/JavaScript URLs carry a content hash (see stampAssets), so browsers
// never combine new pages with yesterday's cached styles or scripts.
const assetFiles = ['analytics.js','seo-site.js','home-gallery.js','seo-site.css','guide-site.css','home.css','go.css'];
const assetPattern = /\/(analytics\.js|seo-site\.js|home-gallery\.js|seo-site\.css|guide-site\.css|home\.css|go\.css)\?v=[\w.-]+/g;
const script = `<script defer src="/analytics.js?v=0"></script>`;
const escape = text => text.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
const siteName = 'Ocean Stay Kojohama';
const ogLocales = {en:'en_GB', ja:'ja_JP', 'zh-CN':'zh_CN'};
// Width and height of local WebP/PNG/JPEG files, read from the file header.
function imageSize(file) {
  if (!fs.existsSync(file)) return null;
  const b = fs.readFileSync(file);
  if (b.toString('ascii',0,4)==='RIFF' && b.toString('ascii',8,12)==='WEBP') {
    const chunk = b.toString('ascii',12,16);
    if (chunk==='VP8X') return {width:1+b.readUIntLE(24,3), height:1+b.readUIntLE(27,3)};
    if (chunk==='VP8 ') return {width:b.readUInt16LE(26)&0x3fff, height:b.readUInt16LE(28)&0x3fff};
    if (chunk==='VP8L') { const bits=b.readUInt32LE(21); return {width:(bits&0x3fff)+1, height:((bits>>14)&0x3fff)+1}; }
  }
  if (b.readUInt32BE(0)===0x89504e47) return {width:b.readUInt32BE(16), height:b.readUInt32BE(20)};
  if (b[0]===0xff && b[1]===0xd8) for (let i=2;i<b.length-9;) {
    if (b[i]!==0xff) { i++; continue; }
    const marker=b[i+1], length=b.readUInt16BE(i+2);
    if (marker>=0xc0 && marker<=0xcf && ![0xc4,0xc8,0xcc].includes(marker)) return {width:b.readUInt16BE(i+7), height:b.readUInt16BE(i+5)};
    i+=2+length;
  }
  return null;
}
// One regenerated block of social-preview tags, so later fixes reach every page.
function openGraphExtras(source, lang) {
  source = source.replace(/<!-- og-extra:start -->[\s\S]*?<!-- og-extra:end -->\n?/g,'')
    .replace(/<meta\b[^>]*property="og:(?:locale(?::alternate)?|site_name|image:width|image:height)"[^>]*>\n?/g,'');
  if (!/property="og:title"/.test(source)) return source;
  const tags = [`<meta property="og:site_name" content="${siteName}">`, `<meta property="og:locale" content="${ogLocales[lang]}">`];
  for (const [, hreflang] of source.matchAll(/<link\b[^>]*hreflang="([^"]+)"[^>]*>/g))
    if (ogLocales[hreflang] && hreflang !== lang) tags.push(`<meta property="og:locale:alternate" content="${ogLocales[hreflang]}">`);
  const image = source.match(/<meta\b[^>]*property="og:image"[^>]*>/)?.[0]?.match(/content="https:\/\/kojohamacabins\.jp(\/[^"]+)"/)?.[1];
  const size = image && imageSize(path.join(root, decodeURIComponent(image).slice(1)));
  if (size) tags.push(`<meta property="og:image:width" content="${size.width}">`, `<meta property="og:image:height" content="${size.height}">`);
  return source.replace(/\s*<\/head>/, `\n<!-- og-extra:start -->${[...new Set(tags)].join('')}<!-- og-extra:end -->\n</head>`);
}
function render(source, file, lang) {
  if (file === 'googlefa3fab5b6b918158.html') return source;
  // The former share image path never existed; use the real exterior photograph.
  source = source.replaceAll('https://kojohamacabins.jp/images/outside/outside-hero-sunset.webp','https://kojohamacabins.jp/images/exterior/outside-hero-sunset.webp');
  // Empty comment pairs left behind by the retired inline tag-manager loader.
  source = source.replace(/[ \t]*<!-- Google Tag Manager(?: \(noscript\))? -->\s*<!-- End Google Tag Manager(?: \(noscript\))? -->\n?/g,'');
  // The old homepage translation script is gone; keep only the anchors the build uses.
  source = source.replace(/\sdata-i18n="((?:sol|zen|rustic)_p2)"/g,' data-copy="$1"').replace(/\sdata-i18n="[^"]*"/g,'');
  // Only the first, above-the-fold hero gets high network priority.
  source=source.replace(/(<section\b[^>]*class="page-hero"[^>]*>\s*)(<img\b[^>]*>)/,(_,start,img)=>start+img.replace(/\s(?:fetchpriority|loading)="[^"]*"/g,'').replace(/>$/,' fetchpriority="high" decoding="async">').replace(/decoding="async"([^>]*?) decoding="async"/,'decoding="async"$1'));
  if(file==='go/index.html'||/privacy\/index\.html$/.test(file)){
    const title=source.match(/<title>([^<]+)<\/title>/)?.[1]||'Ocean Stay Kojohama';
    const descriptionTag=source.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0];
    const description=descriptionTag?.match(/content="([^"]*)"/)?.[1]||title;
    const url='https://kojohamacabins.jp/'+file.replace(/index\.html$/,'');
    if(!source.includes('property="og:title"'))source=source.replace('</head>',`<meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="https://kojohamacabins.jp/images/exterior/outside-hero-sunset.webp"></head>`);
  }
  const prefix = prefixes[lang];
  const route = file === '404.html' ? '' : file.replace(new RegExp('^'+prefix),'').replace(/index\.html$/,'');
  if (route === 'cabins/') source = source.replace(/<body\b(?![^>]*data-page-kind)/, '<body data-page-kind="cabin-comparison"');
  const active = '/' + prefix + route;
  const header = layouts[lang].header.replace(/ aria-current="[^"]*"/g,'').replace(/<a\b[^>]*>/g, tag => {
    const targetLang = tag.match(/\blang="([^"]+)"/)?.[1];
    if (targetLang) {
      tag = tag.replace(/\bhref="[^"]+"/,`href="/${prefixes[targetLang]}${route}"`);
      if (targetLang === lang) tag = tag.replace('<a ', '<a aria-current="page" ');
    } else {
      const href = tag.match(/\bhref="([^"]+)"/)?.[1];
      if (href === active && route) tag = tag.replace('<a ','<a aria-current="page" ');
      else if (/^(?:guides|culture)\//.test(route) && href === '/'+prefix+'things-to-do/') tag = tag.replace('<a ','<a aria-current="true" ');
    }
    return tag;
  });
  source = source.replace(/<header\b[^>]*>[\s\S]*?<\/header>/,header);
  if(layouts[lang].sister) source=source.replace(/<(section|aside)\b[^>]*class="sister wrap"[^>]*>[\s\S]*?<\/\1>/,layouts[lang].sister);
  if (file !== 'go/index.html') source = source.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/,route ? layouts[lang].footer : layouts[lang].homeFooter);
  // Old inline and noscript loaders are deliberately removed; no local fallback.
  source = source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, whole => whole.includes("})(window,document,'script','dataLayer'") ? '' : whole);
  source = source.replace(/<noscript>\s*<iframe\b[^>]*googletagmanager\.com[\s\S]*?<\/iframe>\s*<\/noscript>/g,'');
  source = source.replace(/<script\b[^>]*src="\/analytics\.js[^>]*><\/script>/g,'');
  source = openGraphExtras(source, lang);
  source = source.replace(/\s*<\/head>/, '\n'+script+'\n</head>');
  // Defer order matters: analytics first, shared UI second, home viewer last.
  source = source.replace(/<script\b[^>]*src="\/home-gallery\.js[^>]*><\/script>/g,'');
  if (!route && file !== '404.html') source=source.replace('</body>',`<script defer src="/home-gallery.js?v=0"></script></body>`);
  return source;
}
// Run after media hashing: version every shared CSS/JS reference by its final content.
// Line endings are normalised so Windows and GitHub builds produce the same hash.
function stampAssets() {
  const hashes = Object.fromEntries(assetFiles.map(file => [file, crypto.createHash('sha256')
    .update(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 10)]));
  const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    if (entry.name.startsWith('.') || ['data','scripts','docs','node_modules','media','images'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : entry.name.endsWith('.html') ? [file] : [];
  });
  for (const file of walk(root)) {
    const source = fs.readFileSync(file, 'utf8');
    const stamped = source.replace(assetPattern, (_, name) => `/${name}?v=${hashes[name]}`);
    if (stamped !== source) fs.writeFileSync(file, stamped);
  }
}
module.exports = {render, stampAssets, imageSize};

