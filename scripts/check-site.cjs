// Static release checks using only Node.js built-ins: node scripts/check-site.cjs
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const ignore=new Set(['.git','.wrangler','node_modules','data','scripts','docs']);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>ignore.has(e.name)?[]:e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);
const pages=walk(root);
const source=new Map(pages.map(file=>[file,fs.readFileSync(file,'utf8')]));
const decode=value=>value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const errors=[];
let references=0,schemas=0,inlineScripts=0;
function check(condition,message){if(!condition)errors.push(message)}
function localTarget(url,file){
 let parsed;
 try{parsed=new URL(decode(url),'https://kojohamacabins.jp/'+path.relative(root,file).split(path.sep).join('/'))}catch{return null}
 if(parsed.origin!=='https://kojohamacabins.jp')return null;
 const absolute=path.resolve(root,'.'+decodeURIComponent(parsed.pathname));
 if(!absolute.startsWith(root+path.sep)&&absolute!==root)return null;
 const target=fs.existsSync(absolute)&&fs.statSync(absolute).isDirectory()?path.join(absolute,'index.html'):absolute;
 return {target,hash:decodeURIComponent(parsed.hash.slice(1))};
}
for(const [file,text]of source){
 const name=path.relative(root,file);
 const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>decode(m[1]));
 check(ids.length===new Set(ids).size,`${name}: duplicate HTML id`);
 for(const tag of text.matchAll(/<(?:a|img|script|link|iframe)\b[^>]*>/gi)){
  for(const attr of tag[0].matchAll(/\b(?:href|src)="([^"]*)"/g)){
   if(!attr[1]||/^(?:mailto:|tel:|data:|javascript:)/.test(attr[1]))continue;
   const local=localTarget(attr[1],file);if(!local)continue;references++;
   check(fs.existsSync(local.target),`${name}: missing ${attr[1]}`);
   if(local.hash&&source.has(local.target))check(new RegExp(`\\bid="${local.hash.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`).test(source.get(local.target)),`${name}: missing fragment ${attr[1]}`);
  }
  const set=tag[0].match(/\bsrcset="([^"]+)"/)?.[1];
  if(set)for(const entry of set.split(',')){
   const url=entry.trim().split(/\s+/)[0],local=localTarget(url,file);
   if(local){references++;check(fs.existsSync(local.target),`${name}: missing responsive image ${url}`)}
  }
 }
 // Share previews and structured data point at absolute URLs; those must exist too.
 for(const tag of text.matchAll(/<meta\b[^>]*property="og:(?:image|url)"[^>]*>/g)){
  const url=tag[0].match(/content="([^"]+)"/)?.[1],local=url&&localTarget(url,file);
  if(local){references++;check(fs.existsSync(local.target),`${name}: social preview points to missing ${url}`)}
 }
 for(const block of text.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)){
  for(const url of block[1].match(/https:\/\/kojohamacabins\.jp\/[^"#?\s]*/g)||[]){
   const local=localTarget(url,file);
   if(local){references++;check(fs.existsSync(local.target),`${name}: structured data points to missing ${url}`)}
  }
 }
 // /images originals are not published (.assetsignore); pages must use the hashed /media copies.
 check(!/(?:src|href|srcset|content|data-full-src)="[^"]*\/images\//.test(text)&&!text.includes('kojohamacabins.jp/images/'),`${name}: links to unpublished /images/ originals`);
 for(const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(match[1].includes('application/ld+json')){
   try{JSON.parse(match[2]);schemas++}catch(e){errors.push(`${name}: invalid structured data: ${e.message}`)}
  }else if(!match[1].includes('src=')&&!/type="(?:application\/json|text\/plain)"/.test(match[1])){
   try{new vm.Script(match[2],{filename:name});inlineScripts++}catch(e){errors.push(`${name}: invalid inline JavaScript: ${e.message}`)}
  }
 }
 if(!['404.html','googlefa3fab5b6b918158.html','go/index.html'].includes(name.replace(/\\/g,'/'))){
  check((text.match(/<h1\b/g)||[]).length===1,`${name}: must have one main heading`);
  check(/<link\b[^>]*rel="canonical"/.test(text),`${name}: missing canonical`);
 }
 check(!text.includes('6 名 · 5 台のベッド'),`${name}: stale six-guest cabin capacity`);
}
for(const relative of [
 'ja/guides/hokkaido-winter-driving-kojohama/index.html',
 'ja/guides/stay-between-upopoy-noboribetsu/index.html',
 'zh-cn/guides/hokkaido-winter-driving-kojohama/index.html',
 'zh-cn/guides/stay-between-upopoy-noboribetsu/index.html'
]){
 const text=source.get(path.join(root,...relative.split('/')));
 const description=text?.match(/<meta\b[^>]*name="description"[^>]*content="([^"]+)"/)?.[1]||'';
 const openGraph=text?.match(/<meta\b[^>]*property="og:description"[^>]*content="([^"]+)"/)?.[1]||'';
 check(Array.from(description).length>=60,`${relative}: thin meta description`);
 check(openGraph===description,`${relative}: meta and Open Graph descriptions disagree`);
}
const facts=JSON.parse(fs.readFileSync(path.join(root,'data/site-facts.json'),'utf8'));
for(const [file,text]of source){
 if(facts.bookingChannels?.ctrip && path.relative(root,file).replace(/\\/g,'/').startsWith('zh-cn/')) continue;
 const active=text.replace(/<!-- inactive-ctrip: [\s\S]*? -->/g,'');
 check(!/<a\b[^>]*href="https?:\/\/[^" ]*(?:ctrip\.com|trip\.com)[^" ]*"/.test(active),`${file}: inactive Ctrip booking link is still active`);
 for(const block of active.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)){
  check(!/(?:ctrip\.com|trip\.com)/.test(block[1]),`${path.relative(root,file)}: inactive Ctrip URL remains in structured data`);
 }
}
const llms=fs.readFileSync(path.join(root,'llms.txt'),'utf8');
check(llms.includes('https://guide.kojohamacabins.jp/'),'llms.txt: missing guest guide');
check(llms.includes('Check-in from 14:00')&&llms.includes('Check-in from 15:00'),'llms.txt: cabin check-in times missing');
check(!/ctrip\.com|trip\.com\/hotels/.test(llms),'llms.txt: inactive booking URL');
const directory=JSON.parse(fs.readFileSync(path.join(root,'data/venues.json'),'utf8'));
const imageManifest=JSON.parse(fs.readFileSync(path.join(root,'data/asset-manifest.json'),'utf8'));
for(const image of imageManifest.images){
 const file=path.join(root,image.url.slice(1));
 check(fs.existsSync(file),`Missing generated image ${image.url}`);
 if(fs.existsSync(file))check(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===image.sha256,`Generated image content changed: ${image.url}`);
 check(image.url.includes('.'+image.sha256.slice(0,12)+'.'),`Image filename lacks its content hash: ${image.url}`);
}
const redirectRules=fs.readFileSync(path.join(root,'_redirects'),'utf8');
for(const image of imageManifest.images)check(redirectRules.includes(`${image.source} ${image.url} 302`),`Missing redirect for unpublished original ${image.source}`);
for(const file of ['home.css','seo-site.css','go.css','guide-site.css','seo-site.js','home-gallery.js','analytics.js'])check(!fs.readFileSync(path.join(root,file),'utf8').includes('/images/'),`${file}: links to unpublished /images/ originals`);
check(directory.venues.length===65,'Directory must retain all 65 places');
const photoSources=JSON.parse(fs.readFileSync(path.join(root,'data/venue-photo-sources.json'),'utf8'));
check(photoSources.venues.length===65,'Photo source register must cover all 65 places');
for(const record of photoSources.venues){
 const venue=directory.venues.find(v=>v.id===record.id);
 check(Boolean(venue),`${record.id}: photo source has no matching venue`);
 for(const locale of ['en','ja','zh-CN'])check(Boolean(venue?.translations[locale].photo),`${record.id}: missing ${locale} venue photo`);
 if(!record.assetSHA256)continue;
 for(const asset of [record,record.responsiveAsset].filter(Boolean)){
  const file=path.join(root,asset.asset.replace(/^\//,''));
  check(fs.existsSync(file),`${record.id}: missing registered photo ${asset.asset}`);
  if(fs.existsSync(file))check(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===(asset.assetSHA256||asset.sha256),`${record.id}: photo differs from reviewed asset ${asset.asset}`);
 }
 check(Boolean(record.permission)&&Boolean(record.profileUrl),`${record.id}: missing photo permission/source record`);
 for(const locale of ['en','ja','zh-CN'])check(venue?.translations[locale].photo.creditHtml?.includes('https://www.google.com/maps/'),`${record.id}: missing visible ${locale} photo-source credit`);
}
for(const locale of ['en','ja','zh-CN']){
 const prefix=locale==='en'?'':locale==='ja'?'ja/':'zh-cn/';
 const text=fs.readFileSync(path.join(root,prefix+'things-to-do/index.html'),'utf8');
 check((text.match(/data-venue=/g)||[]).length===65,`${locale}: missing directory records`);
 check(!text.includes('class="near-rep"'),`${locale}: unrelated representative photos remain`);
 for(const v of directory.venues){
  check(v.translations[locale].links.length>0,`${locale}: ${v.id} needs a useful destination`);
  check(text.includes(`id="${v.id}"`),`${locale}: ${v.id} has no shareable anchor`);
  check(!v.hoursCheckedOn || /^\d{4}-\d{2}-\d{2}$/.test(v.hoursCheckedOn),`${v.id}: invalid checked date`);
   check(!v.accessCheckedOn || /^\d{4}-\d{2}-\d{2}$/.test(v.accessCheckedOn),`${v.id}: invalid access review date`);
   check(!(v.hoursCheckedOn && v.accessCheckedOn),`${v.id}: hours and access review must be distinguished`);
   check(!v.hoursCheckedOn || /^https:\/\//.test(v.hoursSource || ''),`${v.id}: checked hours need a source`);
   check(!v.accessCheckedOn || /^https:\/\//.test(v.accessSource || ''),`${v.id}: access review needs a source`);
   check(!v.reviewAttemptedOn || (v.reviewNote && /^\d{4}-\d{2}-\d{2}$/.test(v.reviewAttemptedOn)),`${v.id}: research attempt needs a date and outcome`);
 }
 const comparison=fs.readFileSync(path.join(root,prefix+'cabins/index.html'),'utf8');
 for(const c of facts.cabins){
  const activeComparison=comparison.replace(/<!-- inactive-ctrip: [\s\S]*? -->/g,'');
  check(activeComparison.includes(c.airbnb),`${locale}: missing Airbnb channel for ${c.id}`);
  check(facts.bookingChannels?.ctrip && locale==='zh-CN' ? activeComparison.includes(c.ctrip) : !activeComparison.includes(c.ctrip),`${locale}: wrong Ctrip visibility for ${c.id}`);
  const page=fs.readFileSync(path.join(root,prefix+`cabins/ocean-stay-${c.id}/index.html`),'utf8');
  for(const block of page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){
   const visit=node=>{
    if(!node||typeof node!=='object')return;
    if(node['@type']==='Accommodation'&&node.occupancy)check(node.occupancy.maxValue===c.maxGuests,`${locale}: ${c.id} capacity disagrees with shared facts`);
    Object.values(node).forEach(visit);
   };visit(JSON.parse(block[1]));
  }
 }
 const bbq=fs.readFileSync(path.join(root,prefix+'bbq/index.html'),'utf8');
 check(bbq.includes('2000017066.pdf'),`${locale}: missing manufacturer instructions`);
 check(!/one canister, but|1本でも点火可能|一罐也可以点火/.test(bbq),`${locale}: unsafe one-cartridge instructions`);
 check(!/¥3,500[^<]{0,50}per use|1回3,500|每次¥3,500/.test(bbq),`${locale}: old BBQ fee basis remains`);
 const faq=fs.readFileSync(path.join(root,prefix+'faq/index.html'),'utf8');
 check(faq.includes('id="family-policy"'),`${locale}: missing confirmed family/BBQ policy`);
}
for(const sitemap of ['sitemap.xml','sitemap-zh-cn.xml']){
 const xml=fs.readFileSync(path.join(root,sitemap),'utf8');
 for(const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){
  const local=localTarget(match[1],path.join(root,'index.html'));check(local&&fs.existsSync(local.target),`${sitemap}: nonexistent indexed page ${match[1]}`);
 }
}
const ignored=fs.readFileSync(path.join(root,'.assetsignore'),'utf8');
for(const item of ['wrangler.jsonc','.git','data','scripts','docs','.github','package.json','package-lock.json','images'])check(ignored.split(/\r?\n/).includes(item),`Private deployment file/folder not excluded: ${item}`);
for(const [file,text]of source){
 if(path.basename(file)==='googlefa3fab5b6b918158.html')continue;
 check(text.includes('/analytics.js?v='),`${file}: missing shared analytics loader`);
 check(!text.includes('googletagmanager.com/ns.html'),`${file}: no-JavaScript analytics bypasses preview exclusion`);
 check(!text.includes('window,document,\'script\',\'dataLayer\''),`${file}: duplicated inline analytics loader remains`);
}
for(const file of ['seo-site.js','analytics.js','home-gallery.js','scripts/sync-content.cjs','scripts/assets.cjs','scripts/layouts.cjs','scripts/review-venues.cjs']){
 try{new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file})}catch(e){errors.push(e.message)}
}
// SEO release invariants.
const sitemapUrls=require('./sitemaps.cjs').listedUrls();
const redirects=fs.readFileSync(path.join(root,'_redirects'),'utf8').split(/\r?\n/).filter(line=>line&&!line.startsWith('#')).map(line=>line.split(/\s+/));
for(const url of sitemapUrls){
 const route=new URL(url).pathname;
 check(route==='/'||route.endsWith('/'),'Sitemap page has no trailing slash: '+url);
 if(route!=='/'){
  check(redirects.some(r=>r[0]===route.slice(0,-1)&&r[1]===route&&r[2]==='301'),'Missing permanent redirect: '+route);
  check(!redirects.some(r=>r[0]===route),'Canonical page is itself redirected: '+route);
 }
}
for(const [file,html]of source){
 const hero=html.match(/<img\b[^>]*class="hero-img"[^>]*>/)?.[0];
 const preload=html.match(/<link\b[^>]*as="image"[^>]*rel="preload"[^>]*>/)?.[0];
 if(hero&&preload){
  const attr=(tag,name)=>tag.match(new RegExp('\\b'+name+'="([^"]+)"'))?.[1];
  check(attr(hero,'srcset')===attr(preload,'imagesrcset'),file+': hero preload selects different image sizes');
  check(attr(hero,'sizes')===attr(preload,'imagesizes'),file+': hero preload has different layout sizes');
 }
}
const {imageSize}=require('./layouts.cjs');
for(const [file,html] of source){
 const name=path.relative(root,file).split(path.sep).join('/');
 for(const tag of html.matchAll(/<img\b[^>]*>/g)){
  const src=tag[0].match(/\bsrc="([^"]+)"/)?.[1];
  const width=Number(tag[0].match(/\bwidth="(\d+)"/)?.[1]);
  const height=Number(tag[0].match(/\bheight="(\d+)"/)?.[1]);
  if(!src||!src.startsWith('/')||!width||!height)continue;
  const size=imageSize(path.join(root,decodeURIComponent(src.split('?')[0].slice(1))));
  if(!size)continue;
  check(Math.abs(width/height/(size.width/size.height)-1)<0.02,`${name}: ${src} is ${size.width}×${size.height} but marked ${width}×${height}`);
 }
}
const reviewMonths={january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};
const reviewToday=new Date(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+'T00:00:00Z');
const reviewAge=(year,month,day)=>(reviewToday-Date.UTC(year,month-1,day))/86400000;
for(const [file,html] of source){
 const name=path.relative(root,file).split(path.sep).join('/');
 const ages=[];
 for(const match of html.matchAll(/as shown (?:by|on) each platform on (\d{1,2}) ([A-Za-z]+) (\d{4})/g)){
  const month=reviewMonths[match[2].toLowerCase()];
  check(Boolean(month),`${name}: unreadable English review date`);
  if(month)ages.push(reviewAge(Number(match[3]),month,Number(match[1])));
 }
 for(const match of html.matchAll(/(\d{4})年(\d{1,2})月(\d{1,2})日時点の各サイト表示/g))ages.push(reviewAge(Number(match[1]),Number(match[2]),Number(match[3])));
 for(const match of html.matchAll(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日各平台显示/g))ages.push(reviewAge(Number(match[1]),Number(match[2]),Number(match[3])));
 for(const age of ages)check(age<=30,`${name}: review snapshot is ${Math.floor(age)} days old`);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
else console.log(`PASS: ${pages.length} HTML files, ${references} local references, ${schemas} structured-data blocks, ${inlineScripts} inline scripts, 65 venues in three languages, booking channels and source deployment exclusions.`);
