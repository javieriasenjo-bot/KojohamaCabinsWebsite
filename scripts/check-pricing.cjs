// Guard: published pages must not quote accommodation (per-night) prices. Guests check rates on the
// booking platform. Non-room fees (BBQ, cleaning, extra guests, deposits) are allowed to appear.
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const skip=new Set(['.git','.wrangler','node_modules','data','scripts','docs','media','images']);
const amount='(?:[¥￥]\\s?\\d[\\d,]*|\\d[\\d,]*\\s?円)';
const nightWord='(?:night|nightly|[1-9１-９一]\\s?泊|[1-9１-９一]\\s?晚|每晚|毎晩|每夜)';
// An amount within ~40 characters of a night word, in either order.
const near=new RegExp(`${amount}[^<>]{0,40}${nightWord}|${nightWord}[^<>]{0,40}${amount}`,'i');
// Text around a match that marks it as a non-room fee.
const allowed=/unregistered|undeclared|未登録|未申告|未登记|BBQ|barbecue|バーベキュー|烧烤|烤肉|cleaning|清掃|清洁|extra guest|追加人数|加人|deposit|デポジット|押金/i;
function offenders(text){
  const found=[];
  const plain=text.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,m=>m).replace(/<(?!\/?script)[^>]+>/g,' ');
  for(const m of plain.matchAll(new RegExp(near.source,'gi'))){
    const start=Math.max(0,m.index-60),context=plain.slice(start,m.index+m[0].length+60);
    if(!allowed.test(context))found.push(m[0].trim().replace(/\s+/g,' '));
  }
  return found;
}
function scan(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(e.name.startsWith('.')||skip.has(e.name))continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory())scan(p);
    else if(p.endsWith('.html')){
      const s=fs.readFileSync(p,'utf8');
      const rel=path.relative(root,p);
      assert(!/class="date-check-data"|data-rate-start=|"priceRange"|"AggregateOffer"|"lowPrice"/.test(s),rel+' exposes a rate calendar, offer or price calculator');
      const bad=offenders(s);
      assert(bad.length===0,`${rel} quotes a nightly accommodation price: ${bad.slice(0,3).join(' | ')}`);
    }
  }
}
scan(root);
console.log('PASS: no accommodation prices, rate calendars, offers or price calculators in published HTML.');
const llms=fs.readFileSync(path.join(root,'llms.txt'),'utf8');
assert(!/#seasonal-rates|weekday ¥|weekend ¥/.test(llms),'llms.txt links to rates');
const llmsBad=offenders(llms);
assert(llmsBad.length===0,'llms.txt quotes a nightly accommodation price: '+llmsBad.slice(0,3).join(' | '));
console.log('PASS: llms.txt publishes no accommodation prices.');
