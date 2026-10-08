const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const layouts = JSON.parse(fs.readFileSync(path.join(root, 'data/layouts.json'), 'utf8'));
const prefixes = {en:'', ja:'ja/', 'zh-CN':'zh-cn/'};
const version = '12.25';
const script = `<script defer src="/analytics.js?v=${version}"></script>`;
const escape = text => text.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
function render(source, file, lang) {
  if (file === 'googlefa3fab5b6b918158.html') return source;
  // Only the first, above-the-fold hero gets high network priority.
  source=source.replace(/(<section\b[^>]*class="page-hero"[^>]*>\s*)(<img\b[^>]*>)/,(_,start,img)=>start+img.replace(/\s(?:fetchpriority|loading)="[^"]*"/g,'').replace(/>$/,' fetchpriority="high" decoding="async">').replace(/decoding="async"([^>]*?) decoding="async"/,'decoding="async"$1'));
  if(file==='go/index.html'||/privacy\/index\.html$/.test(file)){
    const title=source.match(/<title>([^<]+)<\/title>/)?.[1]||'Ocean Stay Kojohama';
    const descriptionTag=source.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0];
    const description=descriptionTag?.match(/content="([^"]*)"/)?.[1]||title;
    const url='https://kojohamacabins.jp/'+file.replace(/index\.html$/,'');
    if(!source.includes('property="og:title"'))source=source.replace('</head>',`<meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="https://kojohamacabins.jp/images/outside/outside-hero-sunset.webp"></head>`);
  }
  const prefix = prefixes[lang];
  const route = file === '404.html' ? '' : file.replace(new RegExp('^'+prefix),'').replace(/index\.html$/,'');
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
  if(layouts[lang].sister) source=source.replace(/<section\b[^>]*class="sister wrap"[^>]*>[\s\S]*?<\/section>/,layouts[lang].sister);
  if (file !== 'go/index.html') source = source.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/,route ? layouts[lang].footer : layouts[lang].homeFooter);
  // Old inline and noscript loaders are deliberately removed; no local fallback.
  source = source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, whole => whole.includes("})(window,document,'script','dataLayer'") ? '' : whole);
  source = source.replace(/<noscript>\s*<iframe\b[^>]*googletagmanager\.com[\s\S]*?<\/iframe>\s*<\/noscript>/g,'');
  source = source.replace(/<script\b[^>]*src="\/analytics\.js[^>]*><\/script>/g,'');
  source = source.replace(/\s*<\/head>/, '\n'+script+'\n</head>');
  source = source.replace(/(\/(?:seo-site\.js|seo-site\.css|guide-site\.css|home\.css|go\.css|home-gallery\.js)\?v=)[\d.]+/g,`$1${version}`);
  // Defer order matters: analytics first, shared UI second, home viewer last.
  source = source.replace(/<script\b[^>]*src="\/home-gallery\.js[^>]*><\/script>/g,'');
  if (!route && file !== '404.html') source=source.replace('</body>',`<script defer src="/home-gallery.js?v=${version}"></script></body>`);
  return source;
}
module.exports = {render};
