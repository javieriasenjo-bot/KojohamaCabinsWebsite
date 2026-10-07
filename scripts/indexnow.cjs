// Submit canonical pages only after their matching source is live.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const settings=JSON.parse(fs.readFileSync(path.join(root,'data/indexnow.json'),'utf8'));
const canonical=[...fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const args=process.argv.slice(2),ref=args.find(a=>a.startsWith('--changed-ref='))?.slice(14);
let urls=canonical;
if(ref){
 const changed=new Set(cp.execFileSync('git',['diff','--name-only',ref,'HEAD'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/));
 urls=canonical.filter(url=>changed.has(new URL(url).pathname.slice(1)+'index.html'));
}
const payload={...settings,urlList:urls};
const normalized=text=>text.replace(/\r\n/g,'\n').trim();
async function verify(){
 const key=await fetch(settings.keyLocation,{redirect:'manual',signal:AbortSignal.timeout(15000)});
 if(key.status!==200||normalized(await key.text())!==settings.key)throw Error('IndexNow key file is not live yet.');
 for(const url of urls){
  const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
  const local=fs.readFileSync(path.join(root,new URL(url).pathname.slice(1),'index.html'),'utf8');
  if(r.status!==200||normalized(await r.text())!==normalized(local))throw Error('Production has not reached this commit: '+url);
 }
}
(async()=>{
 if(!urls.length){console.log('No changed sitemap pages; nothing to submit.');return}
 if(!args.includes('--submit')){console.log(JSON.stringify({dryRun:true,host:settings.host,urlCount:urls.length,urls},null,2));return}
 const attempts=args.includes('--wait-for-deploy')?15:1;
 for(let attempt=1;;attempt++){
  try{await verify();break}catch(error){if(attempt>=attempts)throw error;console.log(error.message+' Retrying in 60 seconds.');await new Promise(resolve=>setTimeout(resolve,60000))}
 }
 const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
 if(![200,202].includes(response.status))throw Error('IndexNow returned '+response.status+': '+await response.text());
 console.log(`IndexNow received ${urls.length} URLs: HTTP ${response.status}. This does not prove indexing.`);
})().catch(error=>{console.error(error.message);process.exitCode=1});
