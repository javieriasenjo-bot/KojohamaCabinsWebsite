// Preserve lastmod unless the main content or page metadata actually changes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),file=path.join(root,'data/sitemap-content.json');
function sync(){
 const records=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 for(const sitemap of ['sitemap.xml','sitemap-zh-cn.xml']){
  const source=fs.readFileSync(path.join(root,sitemap),'utf8');
  const output=source.replace(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g,(entry,url,date)=>{
   const html=fs.readFileSync(path.join(root,new URL(url).pathname.slice(1),'index.html'),'utf8');
   const content=(html.match(/<main\b[\s\S]*?<\/main>/)?.[0]||'')+(html.match(/<title>[\s\S]*?<\/title>/)?.[0]||'')+(html.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0]||'');
   const hash=crypto.createHash('sha256').update(content.replace(/\s+/g,' ')).digest('hex');
   const previous=records[url];
   const lastmod=previous&&previous.hash!==hash?today:previous?.lastmod||date;
   records[url]={hash,lastmod};return entry.replace('<lastmod>'+date+'</lastmod>','<lastmod>'+lastmod+'</lastmod>');
  });
  fs.writeFileSync(path.join(root,sitemap),output);
 }
 fs.writeFileSync(file,JSON.stringify(Object.fromEntries(Object.entries(records).sort(([a],[b])=>a<b?-1:a>b?1:0)),null,2)+'\n');
 console.log('Sitemap dates synchronized with meaningful page content.');
}
module.exports={sync};
if(require.main===module)sync();
