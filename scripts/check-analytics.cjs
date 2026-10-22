// Exercise consent and navigation without any real network requests.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','analytics.js'),'utf8');
const key='kojohama-analytics-choice-v1';
function setup({hostname='kojohamacabins.jp',allowed=null,blocked=false,expired=false}={}){
 const scripts=[],visits=[],values=new Map(),session=new Map(),nodes=new Map();let reloads=0,now=1000;
 if(allowed!==null)values.set(key,JSON.stringify({version:1,allowed,saved:expired?-200*86400000:now}));
 const store=map=>({getItem:k=>{if(blocked)throw Error('blocked');return map.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');map.set(k,v);},removeItem:k=>{if(blocked)throw Error('blocked');map.delete(k);}});
 function element(){return {hidden:false,handlers:{},setAttribute(){},addEventListener(name,fn){this.handlers[name]=fn;},focus(){},appendChild(){},querySelector(selector){if(!nodes.has(selector))nodes.set(selector,element());return nodes.get(selector);}};}
 const body=element(),footer=element(),window={localStorage:store(values),sessionStorage:store(session),beTracker:{t:x=>visits.push(x)}};
 const location={hostname,origin:'https://'+hostname,pathname:'/go/',search:'',reload(){reloads++;}};
 const document={documentElement:{lang:'en'},body,cookie:'',createElement:element,querySelector:()=>footer,head:{appendChild:s=>scripts.push(s)}};
 const context={window,location,document,Date:{now:()=>now},URL};
 const run=()=>vm.runInNewContext(source,context);run();
 return {window,location,scripts,visits,values,session,nodes,run,setNow:n=>{now=n;},reloads:()=>reloads,choose:yes=>nodes.get(yes?'[data-choice="yes"]':'[data-choice="no"]').handlers.click()};
}
for(const hostname of ['localhost','127.0.0.1','preview.example']){
 const h=setup({hostname,allowed:true});assert.equal(h.scripts.length,0);h.window.KojohamaAnalytics.push('test');assert.equal(h.window.dataLayer.length,1);
}
{
 const h=setup();assert.equal(h.scripts.length,0,'No trackers before choice');
 h.window.KojohamaAnalytics.push('cabin_view',{cabin_name:'Ocean Stay Zen'});
 h.window.KojohamaAnalytics.push('contact_click');
 h.choose(true);assert.equal(h.scripts.length,2);
 const commands=h.window.dataLayer.filter(x=>x[0]==='consent');
 assert.equal(commands[0][2].analytics_storage,'denied');assert.equal(commands[1][2].analytics_storage,'granted');
 assert.equal(commands[1][2].ad_storage,'denied');assert.equal(commands[1][2].ad_personalization,'denied');
 assert.equal(h.window.dataLayer.filter(x=>x.event==='cabin_view').length,1,'Late acceptance records the current cabin once');
 assert.equal(h.window.dataLayer.filter(x=>x.event==='contact_click').length,0,'Do not replay pre-consent clicks');
 const tracker=h.scripts.find(x=>x.src.includes('metricool'));tracker.onload();assert.equal(h.visits[0].hash,'ffd44c179566f41dd21d51d09878d58d');
 h.choose(true);assert.equal(h.scripts.length,2,'No duplicate loaders');
 h.choose(false);assert.equal(h.reloads(),1);assert.equal(h.window['ga-disable-G-30NYR8WMT3'],true);
 tracker.onload();assert.equal(h.visits.length,1,'Withdrawal blocks late tracker callback');
 assert.equal(JSON.parse(h.values.get(key)).allowed,false);
}
for(const options of [{allowed:false},{allowed:true,expired:true},{blocked:true}]){
 const h=setup(options);assert.equal(h.scripts.length,0);
 if(options.blocked){assert.doesNotThrow(()=>h.choose(true));assert.equal(h.scripts.length,2,'Blocked storage still allows this-page consent');}
}
{
 const h=setup({allowed:true});assert.equal(h.scripts.length,2,'Saved acceptance restores trackers');
 delete h.window.beTracker;assert.doesNotThrow(()=>h.scripts.find(x=>x.src.includes('metricool')).onload());
}
function replay(destination,age=0,blocked=false){
 const h=setup({allowed:true,blocked});
 assert.equal(h.window.KojohamaAnalytics.queueNavigationEvent({destination_url:destination}),!blocked);
 h.location.pathname='/cabins/';h.setNow(1000+age);h.run();
 const clicks=h.window.dataLayer.filter(x=>x.event==='bio_link_click');h.run();
 assert.equal(h.window.dataLayer.filter(x=>x.event==='bio_link_click').length,clicks.length);assert.equal(h.session.size,0);
 return clicks;
}
const handed=replay('https://kojohamacabins.jp/cabins/');assert.equal(handed.length,1);assert.equal(handed[0].page_path,'/go/');
assert.equal(replay('https://example.com/cabins/').length,0);
assert.equal(replay('https://kojohamacabins.jp/faq/').length,0);
assert.equal(replay('https://kojohamacabins.jp/cabins/',300001).length,0);
assert.equal(replay('https://kojohamacabins.jp/cabins/',0,true).length,0);
const headers=fs.readFileSync(path.join(__dirname,'..','_headers'),'utf8');
assert(/script-src[^;]*https:\/\/tracker\.metricool\.com/.test(headers));
assert(/connect-src[^;]*https:\/\/tracker\.metricool\.com/.test(headers));
assert(!/script-src[^;]*'unsafe-inline'/.test(headers));
assert(!/timeZone|Europe\//.test(source),'Consent must not depend on device time zone');
console.log('PASS: explicit opt-in, deny/expiry/blocked storage, withdrawal, no advertising consent, tracker isolation and one-time navigation handoff.');
