// Verify the owner's dated pricing contract in generated pages, not platform quotes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const facts=require('../data/site-facts.json');
assert.equal(facts.pricing.cleaningIncluded,false);
assert.equal(facts.pricing.cleaningJPY,7000);
assert.equal(facts.pricing.extraGuestJPY,2500);
assert.equal(facts.pricing.extraGuestBasis,'per stay');
assert.equal(facts.bbq.feeBasis,'per stay');
assert.deepEqual(facts.pricing.rates,{sol:{weekday:15800,weekend:18500,holiday:23800},zen:{weekday:13800,weekend:16500,holiday:21800},rustic:{weekday:14800,weekend:18500,holiday:22800}});
for(const prefix of ['', 'ja/', 'zh-cn/']){
 const table=fs.readFileSync(path.join(root,prefix+'cabins/index.html'),'utf8');
 for(const amount of ['15,800','18,500','23,800','13,800','16,500','21,800','14,800','22,800']) assert(table.includes('¥'+amount),prefix+amount);
 assert(table.includes('id="seasonal-rates"'));
 for(const id of ['sol','zen','rustic']){
  const page=fs.readFileSync(path.join(root,prefix+'cabins/ocean-stay-'+id+'/index.html'),'utf8');
  assert(page.includes(facts.pricing.rates[id].weekday.toLocaleString('en-US')));
  assert(page.includes('7,000'));
  assert(!page.includes('19,800'));
 }
 const bbq=fs.readFileSync(path.join(root,prefix+'bbq/index.html'),'utf8');
 assert(!/per use|1回3,500|每次¥3,500/.test(bbq));
}
console.log('PASS: three-language dated rate tables, per-cabin rates, separate cleaning and BBQ per stay.');
