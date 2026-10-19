// Check published dates and fee rules independently of OTA availability.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),facts=require('../data/site-facts.json'),schedule=require('../data/date-rates.json');
const {stayTotal}=require('./pricing.cjs');
assert.equal(facts.pricing.cleaningJPY,7000);
assert.equal(facts.pricing.extraGuestJPY,2500);
assert.equal(facts.pricing.extraGuestBasis,'per stay');
assert.equal(facts.pricing.weekendMinimumNights,1);
assert.equal(facts.bbq.feeJPY,3500);
assert.equal(facts.bbq.feeBasis,'per stay');
assert.equal(schedule.days.length,259);
assert.equal(schedule.days[0].date,'2026-10-16');
assert.equal(schedule.days.at(-1).date,'2027-07-01');
for(let i=0;i<schedule.days.length;i++){
 const d=schedule.days[i];
 if(i)assert.equal(Date.parse(d.date)-Date.parse(schedule.days[i-1].date),86400000);
 for(const c of facts.cabins){assert(Number.isInteger(d.rates[c.id])&&d.rates[c.id]>0);assert([1,2].includes(d.minimumNights[c.id]));}
}
assert.equal(stayTotal('sol',['2026-11-06'],2),25800);
assert.equal(stayTotal('zen',['2026-11-06','2026-11-07'],5),48100);
assert.equal(stayTotal('sol',['2026-12-30','2026-12-31'],2),54600);
assert.equal(stayTotal('rustic',['2027-05-04','2027-05-05'],2),49600);
assert.equal(stayTotal('zen',['2027-07-01'],2),24800);
assert.throws(()=>stayTotal('sol',['2026-11-20'],2),/minimum/);
assert.doesNotThrow(()=>stayTotal('zen',['2026-11-20'],2));
assert.throws(()=>stayTotal('zen',['2026-12-31'],2),/minimum/);
assert.throws(()=>stayTotal('sol',['2027-07-02'],2),/outside/);
assert.throws(()=>stayTotal('sol',['2026-11-06','2026-11-08'],2),/consecutive/);
assert.throws(()=>stayTotal('zen',['2026-11-06'],6),/Guests/);
for(const prefix of ['', 'ja/', 'zh-cn/']){
 const html=fs.readFileSync(path.join(root,prefix+'cabins/index.html'),'utf8');
 const ranges=[...html.matchAll(/<tr data-rate-start="([\d-]+)" data-rate-end="([\d-]+)">([\s\S]*?)<\/tr>/g)],seen=new Set();
 for(const [,start,end,row] of ranges){
  const included=schedule.days.filter(d=>d.date>=start&&d.date<=end);
  assert(included.length);
  for(const d of included){
   assert(!seen.has(d.date));seen.add(d.date);
   const cells=[...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m=>m[1]);
   facts.cabins.forEach((c,i)=>assert.equal(cells[i],'¥'+d.rates[c.id].toLocaleString('en-US'),prefix+d.date+c.id));
   const minimum=new Set(Object.values(d.minimumNights)).size===1?String(d.minimumNights.sol):facts.cabins.map(c=>`${c.name}: ${d.minimumNights[c.id]}`).join(' / ');
   assert.equal(cells[3],minimum,prefix+d.date+' arrival minimums');
  }
 }
 assert.equal(seen.size,259,prefix+' calendar coverage');
 assert(html.includes('id="stay-total-examples"'));
 for(const id of ['sol','zen','rustic']){
  const page=fs.readFileSync(path.join(root,prefix+'cabins/ocean-stay-'+id+'/index.html'),'utf8');
  assert(page.includes(facts.pricing.rates[id].weekday.toLocaleString('en-US')));
  assert(page.includes('7,000'));
 }
 const home=fs.readFileSync(path.join(root,prefix+'index.html'),'utf8');
 assert(home.includes('home-stay-example')&&home.includes('20,800'));
 assert(!/Oct–24 Dec|October–24 December|1月4日以降はこの料金表/.test(html+home));
}
// "Check your dates" blocks carry the same nightly schedule and fees as the rate tables.
for (const prefix of ['', 'ja/', 'zh-cn/']) for (const cabin of facts.cabins) {
 const page = fs.readFileSync(path.join(root, prefix, 'cabins', `ocean-stay-${cabin.id}`, 'index.html'), 'utf8');
 const json = page.match(/<script type="application\/json" class="date-check-data">([\s\S]*?)<\/script>/);
 assert(json, `${prefix}${cabin.id}: date checker missing`);
 const data = JSON.parse(json[1]);
 assert.equal(data.start, schedule.days[0].date);
 assert.deepEqual(data.rates, schedule.days.map(d => d.rates[cabin.id]), `${prefix}${cabin.id}: stale date-checker rates`);
 assert.deepEqual(data.min, schedule.days.map(d => d.minimumNights[cabin.id]));
 assert.equal(data.cleaning, schedule.cleaningJPY); assert.equal(data.extra, schedule.extraGuestJPY);
 const first = data.rates.slice(0, 2).reduce((a, b) => a + b, 0) + data.cleaning + 3 * data.extra;
 assert.equal(first, stayTotal(cabin.id, schedule.days.slice(0, 2).map(d => d.date), 5), 'Checker arithmetic matches stayTotal');
 assert(page.includes(`href="${cabin.airbnb}" rel="noopener" target="_blank">`) && page.includes('data-link-location="date_check"'));
}
console.log('PASS: 259 dated nights in three languages, special arrival minimums, mixed-rate totals, once-per-stay fees and date-checker data.');
