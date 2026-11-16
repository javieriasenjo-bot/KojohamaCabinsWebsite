// Responsive smoke checks in Chromium and WebKit. All external requests are blocked.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const engines=require(process.env.KOJOHAMA_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),facts=require('../data/site-facts.json');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404).end();return;}
 res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`,results=[];
 const output=process.env.KOJOHAMA_SCREENSHOTS;
 if(output)fs.mkdirSync(output,{recursive:true});
 for(const engine of ['chromium','webkit']){
  browser=await engines[engine].launch({headless:true});
  for(const mobile of [true,false]){
   const context=await browser.newContext({isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
   await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
   const page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   for(const width of mobile?[320,390,430]:[768,1440]){
    await page.setViewportSize({width,height:900});
    for(const [lang,prefix] of [['en',''],['ja','ja/'],['zh-CN','zh-cn/']]){
     for(const route of ['', 'cabins/','guides/shiraoi-kojohama-coast/']){
      const label=`${engine} ${lang} ${route||'home'} ${width}`;
      await page.goto(base+'/'+prefix+route,{waitUntil:'networkidle'});
      assert(await page.locator('h1').count(),label+': missing heading');
      assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),label+': horizontal page overflow');
      if(route===''){
       for(const action of await page.locator('.hero-actions a').all()){
        assert(await action.isVisible(),label+': hidden hero action');
        const box=await action.boundingBox(),hero=await page.locator('.hero').boundingBox();
        assert(box.height>=44&&box.x>=0&&box.x+box.width<=width+1,label+': touch target or width');
        assert(box.y>=hero.y&&box.y+box.height<=hero.y+hero.height+1,label+': clipped action');
       }
       assert.equal(await page.locator('.hero-actions a').first().getAttribute('href'),facts.bookingUrl[lang]);
       if(mobile){
        const menu=page.locator('.menu-toggle');await menu.tap();
        assert.equal(await menu.getAttribute('aria-expanded'),'true',label+': touch menu failed');
        for(const link of await page.locator('#site-navigation a').all()){
         assert(await link.isVisible(),label+': hidden navigation link');
         const box=await link.boundingBox();assert(box.height>=44,label+': navigation touch target');
        }
        await menu.tap();assert.equal(await menu.getAttribute('aria-expanded'),'false');
       }
       if(output&&(width===390||width===1440))await page.screenshot({path:path.join(output,`${engine}-${lang}-home-${width}.png`)});
      }
      if(route==='cabins/'){
       for(const img of await page.locator('.comparison-photo-grid img').all())await img.evaluate(el=>{el.loading='eager';return el.decode();});
       const layout=await page.locator('.cabin-comparison .comparison-scroll').evaluate(el=>({overflow:getComputedStyle(el).overflowX,wide:el.scrollWidth>el.clientWidth}));
       if(mobile){assert(layout.wide,label+': comparison should retain readable columns');assert(['auto','scroll'].includes(layout.overflow),label+': table must scroll');}
       if(output&&width===390)await page.locator('.comparison-photos').screenshot({path:path.join(output,`${engine}-${lang}-comparison-390.png`)});
      }
      results.push({engine,language:lang,route:route||'home',width,touch:mobile});
     }
    }
   }
   assert.deepEqual(errors,[],engine+': JavaScript errors');await context.close();
  }
  await browser.close();browser=null;
 }
 fs.writeFileSync(path.join(root,'docs/responsive-check-summary.json'),JSON.stringify({checks:results.length,engines:['chromium','webkit'],mobileWidths:[320,390,430],tabletDesktopWidths:[768,1440],noRealExternalRequestsSent:true,physicalDeviceTest:false,results},null,2)+'\n');
 console.log(`PASS: ${results.length} responsive page checks across Chromium and WebKit, three languages, touch menus, booking actions and comparison photos.`);
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.closeAllConnections();server.close();});
