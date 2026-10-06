// Local, offline browser checks. No enquiries, reservations or real analytics are sent.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.KOJOHAMA_PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
 let file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep) && file!==root){response.writeHead(403).end();return}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){response.writeHead(404).end();return}
 response.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});response.end(fs.readFileSync(file));
});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true,...(process.env.KOJOHAMA_CHROME_PATH?{executablePath:process.env.KOJOHAMA_CHROME_PATH}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const blocked=[];
 await context.route('**/*',route=>{
  if(new URL(route.request().url()).hostname==='127.0.0.1')return route.continue();
  blocked.push(route.request().url());return route.abort();
 });
 const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const visit=route=>page.goto(base+route,{waitUntil:'networkidle'});
 const stopNavigation=()=>page.evaluate(()=>document.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault()}));
 const clickEvent=async(selector,event)=>{
  await page.evaluate(()=>{window.dataLayer=[]});await page.locator(selector).first().click();
  const events=await page.evaluate(()=>window.dataLayer);
  assert.equal(events.length,1,selector+' must emit exactly one event');assert.equal(events[0].event,event);return events[0];
 };
 const results=[];
 for(const prefix of ['','ja/','zh-cn/']){
  for(const width of [320,390]){
   await page.setViewportSize({width,height:844});
   for(const route of ['', 'cabins/', 'things-to-do/']){
    await visit('/'+prefix+route);
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),prefix+route+' overflows at '+width);
   }
  }
  await page.setViewportSize({width:390,height:844});
  await visit('/'+prefix);
  const trigger=page.locator('[data-gallery-open="zen"]').first();await trigger.click();
  const homeDialog=page.locator('#photo-lightbox');assert(await homeDialog.isVisible());
  await homeDialog.locator('img').evaluate(image=>image.decode());
  assert((await homeDialog.locator('img').getAttribute('src')).startsWith('/media/'));
  await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'lightbox-next');
  await page.keyboard.press('Escape');assert(await homeDialog.isHidden());
  assert.equal(await trigger.evaluate(element=>element===document.activeElement),true);
  await visit('/'+prefix+'things-to-do/#directory-4');assert(await page.locator('#directory-4').evaluate(element=>element.open));
  await visit('/'+prefix+'things-to-do/#venue-55');assert(await page.locator('#venue-55').evaluate(element=>element.closest('details').open));
  assert.equal(await page.locator('[data-venue]').count(),65);
  await page.locator('#directory-query').fill('ナチュ');assert.equal(await page.locator('[data-venue]:visible').count(),3);
  await page.locator('#directory-query').fill('no-match-123456');assert.equal(await page.locator('[data-venue]:visible').count(),0);
  await page.locator('#directory-clear').click();assert(await page.locator('#directory-4').evaluate(element=>element.open));
  await page.locator('.directory-category').evaluateAll(elements=>elements.forEach(element=>element.open=true));
  const loaded=await page.locator('[data-venue] img').evaluateAll(async elements=>Promise.all(elements.map(async image=>{image.loading='eager';try{await image.decode();return image.naturalWidth>0}catch{return false}})));
  assert.equal(loaded.length,65);assert(loaded.every(Boolean));
  await visit('/'+prefix+'cabins/ocean-stay-sol/');
  const thumb=page.locator('.gallery-section img').first();await thumb.scrollIntoViewIfNeeded();await thumb.evaluate(image=>image.decode());
  const full=await thumb.getAttribute('data-full-src');assert(full);
  const smallWidth=await thumb.evaluate(image=>image.naturalWidth);await thumb.click();
  const viewer=page.locator('.pv img');await viewer.evaluate(image=>image.decode());assert.equal(await viewer.getAttribute('src'),full);
  assert((await viewer.evaluate(image=>image.naturalWidth))>smallWidth,'Viewer should fetch the full photo, not its thumbnail');
  await page.keyboard.press('Escape');assert(await thumb.evaluate(element=>element===document.activeElement));
  await stopNavigation();
  const review=await clickEvent('a[href*="airbnb."][data-link-location="reviews"]','review_click');assert.equal(review.intent,'reviews');
  const bookingReview=await clickEvent('a[data-intent="reviews"][href*="booking.com"]','review_click');assert.equal(bookingReview.booking_platform,'booking.com');assert.equal(bookingReview.cabin_name,'All cabins');
  const booking=await clickEvent('a[href*="ctrip.com"]','booking_click');assert.equal(booking.intent,'booking');assert.equal(booking.booking_platform,'ctrip');
  const language=await clickEvent('.languages a:not([aria-current])','language_change');assert.equal(language.cabin_name,null);assert.equal(language.intent,null);assert.equal(language.page_language,prefix==='ja/'?'ja':prefix==='zh-cn/'?'zh-CN':'en');
  results.push({language:prefix||'en',mobileWidths:[320,390],directoryPhotos:65,deepLinks:true,search:true,galleries:true,events:true});
 }
 await visit('/go/?utm_source=browser-check&utm_campaign=test&email=must-not-propagate');
 assert(await page.locator('a[href*="/privacy/"]').count());
 const internal=await page.locator('a[href*="/location/"]').getAttribute('href');assert(internal.includes('utm_source=browser-check'));assert(!internal.includes('email='));
 await stopNavigation();await clickEvent('a[href*="line.me"]','contact_click');await clickEvent('.row.lang a[lang="ja"]','language_change');
 await clickEvent('a[href*="ctrip.com"]','booking_click');await clickEvent('a[href*="instagram.com"]','bio_link_click');
 assert.equal(blocked.filter(url=>url.includes('googletagmanager.com')).length,0,'Local previews must not load GTM');
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const noJSRequests=[];
 await noJS.route('**/*',route=>{noJSRequests.push(route.request().url());return new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort()});
 const fallback=await noJS.newPage();await fallback.goto(base+'/things-to-do/',{waitUntil:'networkidle'});await fallback.locator('#directory-1 summary').click();assert(await fallback.locator('#directory-1').evaluate(element=>element.open));
 assert(!noJSRequests.some(url=>url.includes('googletagmanager.com')));await noJS.close();
 // Simulate a production hostname, proxying only local assets and blocking Google.
 const production=await browser.newContext();let gtmRequests=0;
 await production.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='kojohamacabins.jp'){
   const response=await production.request.get(base+url.pathname+url.search);return route.fulfill({response});
  }
  if(url.hostname==='www.googletagmanager.com')gtmRequests++;return route.abort();
 });
 const productionPage=await production.newPage();await productionPage.goto('https://kojohamacabins.jp/',{waitUntil:'networkidle'});assert.equal(gtmRequests,1,'Production should request one GTM loader');await production.close();
 assert.deepEqual(errors,[],'Browser errors');
 const report={results,noJavaScript:true,previewAnalyticsExcluded:true,productionGtmRequests:gtmRequests,noRealExternalRequestsSent:true};
 fs.writeFileSync(path.join(root,'docs/browser-check-summary.json'),JSON.stringify(report,null,2)+'\n');
 console.log('PASS: three-language mobile layouts, directory deep links/search/all 65 photos, full-size galleries, event consistency, no-JavaScript and analytics hostname isolation.');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
