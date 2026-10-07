// Read-only public checks; cannot establish a search engine's indexed state.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const urls=[...fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const rows=[];let cursor=0;
 await Promise.all(Array.from({length:5},async()=>{while(cursor<urls.length){const url=urls[cursor++];try{
  const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)}),html=await response.text();
  const tag=html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0];
  const canonical=tag?.match(/href="([^"]+)"/)?.[1];
  const robots=[...html.matchAll(/<meta\b[^>]*name="robots"[^>]*>/g)].map(m=>m[0]).join(' ')+(response.headers.get('x-robots-tag')||'');
  rows.push({url,status:response.status,canonical,noindex:/noindex/i.test(robots),ok:response.status===200&&canonical===url&&!/noindex/i.test(robots)});
 }catch(e){rows.push({url,ok:false,error:e.message})}}}));
 rows.sort((a,b)=>a.url<b.url?-1:1);
 fs.writeFileSync(path.join(root,'docs/PUBLIC-SEARCH-AUDIT.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'Public HTTP and canonical checks; not Google or Bing index status',pages:rows},null,2)+'\n');
 console.log(JSON.stringify({pages:rows.length,passed:rows.filter(r=>r.ok).length,issues:rows.filter(r=>!r.ok)},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
