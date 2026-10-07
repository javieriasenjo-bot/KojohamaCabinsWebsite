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
}
const facts=JSON.parse(fs.readFileSync(path.join(root,'data/site-facts.json'),'utf8'));
const directory=JSON.parse(fs.readFileSync(path.join(root,'data/venues.json'),'utf8'));
const imageManifest=JSON.parse(fs.readFileSync(path.join(root,'data/asset-manifest.json'),'utf8'));
for(const image of imageManifest.images){
 const file=path.join(root,image.url.slice(1));
 check(fs.existsSync(file),`Missing generated image ${image.url}`);
 if(fs.existsSync(file))check(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===image.sha256,`Generated image content changed: ${image.url}`);
 check(image.url.includes('.'+image.sha256.slice(0,12)+'.'),`Image filename lacks its content hash: ${image.url}`);
}
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
 }
 const comparison=fs.readFileSync(path.join(root,prefix+'cabins/index.html'),'utf8');
 for(const c of facts.cabins){
  check(comparison.includes(c.airbnb)&&comparison.includes(c.ctrip),`${locale}: missing booking channel for ${c.id}`);
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
 check(!/¥3,500[^<]{0,50}per stay|1滞在3,500|每次入住 ¥3,500/.test(bbq),`${locale}: BBQ fee still incorrectly charged per stay`);
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
for(const item of ['wrangler.jsonc','.git','data','scripts','docs','.github','package.json','package-lock.json'])check(ignored.split(/\r?\n/).includes(item),`Private deployment file/folder not excluded: ${item}`);
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
const sitemapUrls=[...fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
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
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
else console.log(`PASS: ${pages.length} HTML files, ${references} local references, ${schemas} structured-data blocks, ${inlineScripts} inline scripts, 65 venues in three languages, booking channels and source deployment exclusions.`);
