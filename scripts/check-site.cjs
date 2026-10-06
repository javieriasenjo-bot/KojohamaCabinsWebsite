// Static release checks using only Node.js built-ins: node scripts/check-site.cjs
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
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
check(directory.venues.length===65,'Directory must retain all 65 places');
for(const locale of ['en','ja','zh-CN']){
 const prefix=locale==='en'?'':locale==='ja'?'ja/':'zh-cn/';
 const text=fs.readFileSync(path.join(root,prefix+'things-to-do/index.html'),'utf8');
 check((text.match(/data-venue=/g)||[]).length===65,`${locale}: missing directory records`);
 check(!text.includes('class="near-rep"'),`${locale}: unrelated representative photos remain`);
 for(const v of directory.venues){
  check(v.translations[locale].links.length>0,`${locale}: ${v.id} needs a useful destination`);
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
}
for(const sitemap of ['sitemap.xml','sitemap-zh-cn.xml']){
 const xml=fs.readFileSync(path.join(root,sitemap),'utf8');
 for(const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){
  const local=localTarget(match[1],path.join(root,'index.html'));check(local&&fs.existsSync(local.target),`${sitemap}: nonexistent indexed page ${match[1]}`);
 }
}
const ignored=fs.readFileSync(path.join(root,'.assetsignore'),'utf8');
for(const item of ['wrangler.jsonc','.git','data','scripts','docs'])check(ignored.split(/\r?\n/).includes(item),`Private deployment file/folder not excluded: ${item}`);
for(const file of ['seo-site.js','scripts/sync-content.cjs']){
 try{new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file})}catch(e){errors.push(e.message)}
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
else console.log(`PASS: ${pages.length} HTML files, ${references} local references, ${schemas} structured-data blocks, ${inlineScripts} inline scripts, 65 venues in three languages, booking channels and source deployment exclusions.`);
