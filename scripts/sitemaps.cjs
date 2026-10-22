// Preserve lastmod unless the main content or page metadata actually changes.
// Chinese URLs live only in sitemap-zh-cn.xml so the two files do not repeat them.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),file=path.join(root,'data/sitemap-content.json');
const names=['sitemap.xml','sitemap-zh-cn.xml'];
function parse(xml){
 return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)].map(match=>({loc:match[1],lastmod:match[2]}));
}
function isChinese(url){
 const pathname=new URL(url).pathname;
 return pathname==='/zh-cn'||pathname.startsWith('/zh-cn/');
}
function write(name, entries){
 const body=entries.map(entry=>`  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`).join('\n');
 fs.writeFileSync(path.join(root,name),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}
function listedUrls(){
 return names.flatMap(name=>[...fs.readFileSync(path.join(root,name),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]));
}
function sync(){
 const records=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const urls=new Map();
 for(const name of names) for(const entry of parse(fs.readFileSync(path.join(root,name),'utf8'))) if(!urls.has(entry.loc)) urls.set(entry.loc, entry.lastmod);
 for(const [url,date] of urls){
  const html=fs.readFileSync(path.join(root,new URL(url).pathname.slice(1),'index.html'),'utf8');
  const content=(html.match(/<main\b[\s\S]*?<\/main>/)?.[0]||'')+(html.match(/<title>[\s\S]*?<\/title>/)?.[0]||'')+(html.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0]||'');
  const hash=crypto.createHash('sha256').update(content.replace(/\s+/g,' ')).digest('hex');
  const previous=records[url];
  const lastmod=previous&&previous.hash!==hash?today:previous?.lastmod||date;
  records[url]={hash,lastmod};
  urls.set(url,lastmod);
 }
 const sorted=[...urls].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([loc,lastmod])=>({loc,lastmod}));
 write('sitemap.xml', sorted.filter(entry=>!isChinese(entry.loc)));
 write('sitemap-zh-cn.xml', sorted.filter(entry=>isChinese(entry.loc)));
 fs.writeFileSync(file,JSON.stringify(Object.fromEntries(Object.entries(records).sort(([a],[b])=>a<b?-1:a>b?1:0)),null,2)+'\n');
 console.log('Sitemap dates synchronized with meaningful page content.');
}
module.exports={sync,listedUrls};
if(require.main===module)sync();
