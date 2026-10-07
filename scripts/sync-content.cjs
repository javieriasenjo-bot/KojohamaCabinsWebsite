// Regenerate the marked static sections. No package installation is required.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const assets = require('./assets.cjs');
assets.restore();
const layouts = require('./layouts.cjs');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const facts = json('data/site-facts.json');
const directory = json('data/venues.json');
const captions = json('data/gallery-captions.json');
const galleries = json('data/home-galleries.json');
const responsive = json('data/responsive-images.json');
const rate = facts.pricing.fromNightlyJPY.toLocaleString('en-US');
const extra = facts.pricing.extraGuestJPY.toLocaleString('en-US');
const baseGuests = facts.pricing.baseGuests;
const policy = {
 en:{title:'Children, infants and BBQ',childQuestion:'Are children and infants welcome?',childAnswer:'Yes. Children and infants are welcome in all three cabins, with a maximum of five guests per cabin. Ask us about any baby equipment you need before booking.',bbqQuestion:'Can we use the BBQ grill?',bbqAnswer:`Yes, by prior arrangement. Use of our ${facts.bbq.grillProvided} costs ¥${facts.bbq.feeJPY.toLocaleString('en-US')} per use. Guests bring two compatible gas cartridges, food, utensils and other BBQ gear.`,details:'BBQ equipment and safety guide'},
 ja:{title:'お子様・乳幼児とBBQ',childQuestion:'子どもや乳幼児も宿泊できますか？',childAnswer:'はい。3棟ともお子様・乳幼児を歓迎しています。各棟の定員は最大5名です。乳幼児用の設備が必要な場合は、ご予約前にお問い合わせください。',bbqQuestion:'BBQグリルを利用できますか？',bbqAnswer:`はい。事前のご相談で、当施設の${facts.bbq.grillProvided}を1回${facts.bbq.feeJPY.toLocaleString('en-US')}円でご利用いただけます。対応するガス缶2本、食材、調理器具、その他必要なBBQ用品はお客様ご自身でご持参ください。`,details:'BBQの持ち物・安全ガイド'},
 'zh-CN':{title:'儿童、婴幼儿与烧烤',childQuestion:'欢迎儿童和婴幼儿入住吗？',childAnswer:'欢迎。三间小屋均欢迎儿童和婴幼儿，每间最多5位客人。如需婴幼儿设备，请在预订前联系我们确认。',bbqQuestion:'可以使用烧烤炉吗？',bbqAnswer:`可以，请提前联系安排。使用我们的${facts.bbq.grillProvided}每次费用为¥${facts.bbq.feeJPY.toLocaleString('en-US')}。客人需自备两罐兼容燃气罐、食材、餐具和其他烧烤用品。`,details:'烧烤用品与安全指南'}
};
const travelCopy = {
 en:{airport:`${facts.travel.newChitoseMinutes.join('–')} minutes`,casa:`${facts.travel.casaAntonioMinutes.join('–')} minutes`,airportQuestion:'How far is it from New Chitose Airport?',casaQuestion:'Can I combine this with a stay in Sapporo?',airportAnswer:`About ${facts.travel.newChitoseMinutes.join('–')} minutes by car. Allow extra time for winter weather.`,casaAnswer:`Yes. Casa Antonio, our sister property with two apartments near Asabu Station in Sapporo, is about ${facts.travel.casaAntonioMinutes.join('–')} minutes by car from Kojohama. Allow extra time for winter weather and traffic.`},
 ja:{airport:`${facts.travel.newChitoseMinutes.join('〜')}分`,casa:`${facts.travel.casaAntonioMinutes.join('〜')}分`,airportQuestion:'新千歳空港からどのくらいかかりますか？',casaQuestion:'札幌での滞在と組み合わせられますか？',airportAnswer:`車で約${facts.travel.newChitoseMinutes.join('〜')}分です。冬季はさらに時間に余裕を持ってください。`,casaAnswer:`はい。姉妹物件のCasa Antonioは札幌の麻生駅近くにあるアパートメント2室で、虎杖浜から車で約${facts.travel.casaAntonioMinutes.join('〜')}分です。冬季や混雑時は時間に余裕を持ってください。`},
 'zh-CN':{airport:`${facts.travel.newChitoseMinutes.join('–')}分钟`,casa:`${facts.travel.casaAntonioMinutes.join('–')}分钟`,airportQuestion:'从新千岁机场到小屋需要多久？',casaQuestion:'可以与札幌的住宿组合吗？',airportAnswer:`自驾通常约${facts.travel.newChitoseMinutes.join('–')}分钟。冬季天气可能延长行程，请预留更多时间。`,casaAnswer:`可以。姊妹物业Casa Antonio位于札幌麻生站附近，提供两套公寓。从虎杖浜自驾约${facts.travel.casaAntonioMinutes.join('–')}分钟，冬季或交通繁忙时请预留更多时间。`}
};
const pricingCopy = {
 en:`From ¥${rate} per night for up to ${baseGuests} guests, including cleaning and excluding taxes. Each guest beyond the first ${baseGuests} adds ¥${extra} per stay. Rates vary by date; check the final total, fees and cancellation terms on your chosen booking platform before confirming.`,
 ja:`1〜${baseGuests}名で1泊${rate}円から。清掃料金を含み、税金は含みません。${facts.pricing.extraGuestFrom}人目以降は、お一人につき1滞在あたり${extra}円の追加料金がかかります。料金は日程によって変わります。予約を確定する前に、ご利用の予約サイトで最終総額・手数料・キャンセル条件をご確認ください。`,
 'zh-CN':`1至${baseGuests}位客人每晚¥${rate}起，包含清洁费，不含税费。从第${facts.pricing.extraGuestFrom}位客人起，每位额外客人每次入住加收¥${extra}。价格随日期变化；确认预订前，请在所选平台核对最终总价、费用和取消条款。`
};
if (!facts.pricing.cleaningIncluded || facts.pricing.taxesIncluded || facts.pricing.extraGuestBasis !== 'per stay' || facts.pricing.extraGuestFrom !== baseGuests + 1) throw new Error('Pricing policy changed: update and review the localized pricing templates before rebuilding.');
const locales = {
 en: {prefix:'', search:'Search places, food or activities', clear:'Clear search', count:'places', empty:'No matching places. Try another search.', browse:'Browse by category', gallery:'Photo gallery', property:'Property gallery', close:'Close photo gallery', prev:'Previous photo', next:'Next photo', compare:'Compare the essentials', cabin:'Cabin', guests:'Maximum guests', beds:'Beds', view:'View cabin', book:'Check dates', map:'Check current hours and details'},
 ja: {prefix:'ja/', search:'施設名・食べ物・体験で検索', clear:'検索をクリア', count:'件', empty:'該当する施設がありません。別の言葉で検索してください。', browse:'カテゴリーから探す', gallery:'写真ギャラリー', property:'施設の写真', close:'写真ギャラリーを閉じる', prev:'前の写真', next:'次の写真', compare:'基本情報を比較', cabin:'キャビン', guests:'最大宿泊人数', beds:'ベッド数', view:'キャビンの詳細', book:'空室を確認', map:'最新の営業時間・施設情報を確認'},
 'zh-CN': {prefix:'zh-cn/', search:'搜索地点、美食或活动', clear:'清除搜索', count:'个地点', empty:'没有匹配的地点，请尝试其他关键词。', browse:'按类别浏览', gallery:'照片集', property:'小屋外观照片', close:'关闭照片集', prev:'上一张照片', next:'下一张照片', compare:'比较基本信息', cabin:'小屋', guests:'最多入住人数', beds:'床位数', view:'查看小屋', book:'查看日期', map:'确认最新营业时间和信息'}
};
function marked(source, name, content) {
 const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
 if (!pattern.test(source)) throw new Error(`Missing ${name} markers`);
 return source.replace(pattern, `<!-- ${name}:start -->\n${content}\n<!-- ${name}:end -->`);
}
function save(file, source) {
 if (source !== read(file)) fs.writeFileSync(path.join(root, file), source);
}
for (const [lang, t] of Object.entries(locales)) {
 const file = t.prefix + 'things-to-do/index.html';
 const nav = `<nav class="directory-nav" aria-label="${t.browse}">${directory.categories.map(g => `<a href="#${g.id}">${escape(g.title[lang])}</a>`).join('')}</nav>`;
 const search = `<div class="directory-search" hidden><label for="directory-query">${t.search}</label><div class="directory-search-row"><input id="directory-query" type="search" autocomplete="off" aria-describedby="directory-count"><button type="button" id="directory-clear">${t.clear}</button></div><p id="directory-count" role="status" data-count-label="${t.count}">${directory.venues.length} ${t.count}</p><p id="directory-empty" hidden>${t.empty}</p></div>`;
 const groups = directory.categories.map((group, i) => {
  const venues = directory.venues.filter(v => v.category === group.id);
  const cards = venues.map(v => {
   const local = v.translations[lang];
   const photo = local.photo ? `<figure class="near-ph"><img src="${escape(local.photo.src)}"${local.photo.srcset ? ` srcset="${escape(local.photo.srcset)}" sizes="(max-width:600px) calc(100vw - 48px), 400px"`:''} alt="${escape(local.photo.alt)}" loading="lazy" decoding="async" width="${local.photo.width || 640}" height="${local.photo.height || 400}"${local.photo.fit === 'contain' ? ' style="object-fit:contain"':''}${local.photo.src.startsWith('https:') ? ' referrerpolicy="no-referrer"':''}>${local.photo.creditHtml ? `<figcaption>${local.photo.creditHtml}</figcaption>`:''}</figure>` : '';
   const links = [...local.links];
   if (v.hoursSource && !links.some(l => l.href === v.hoursSource)) links.push({href:v.hoursSource,label:t.map,kind:'official'});
   const searchText = Object.values(v.translations).map(l => l.name+' '+l.descriptionHtml.replace(/<[^>]+>/g,' ')).join(' ');
   const share = {en:'Link to this place',ja:'この施設へのリンク','zh-CN':'此地点链接'}[lang];
   const review = v.hoursCheckedOn ? ({en:'Hours checked: ',ja:'営業時間の確認日：','zh-CN':'营业时间核实日期：'}[lang]+v.hoursCheckedOn) : {en:'Confirm current hours before visiting.',ja:'訪問前に最新の営業時間をご確認ください。','zh-CN':'到访前请确认最新营业时间。'}[lang];
   return `<li id="${v.id}" data-venue="${v.id}" data-search="${escape(searchText)}"${!local.photo ? ' class="near-no-photo"':''}>${photo}<div class="near-body"><strong>${escape(local.name)}</strong>${local.drive ? `<span class="near-min">${escape(local.drive)}</span>`:''}<p>${local.descriptionHtml}</p>${local.hours ? `<p class="near-hours">${escape(local.hours)}</p><p class="near-reviewed">${escape(review)}</p>`:''}<p class="place-actions">${links.map(l => `<a href="${escape(l.href)}" rel="noopener" target="_blank" data-link-location="area_directory" data-source-kind="${escape(l.kind)}">${escape(l.label)}</a>`).join(' · ')} · <a class="place-permalink" href="#${v.id}" aria-label="${escape(share+' — '+local.name)}">${share}</a></p></div></li>`;
  }).join('\n');
  return `<details class="directory-category" id="${group.id}"><summary>${escape(group.title[lang])} <span class="directory-group-count">(${venues.length})</span></summary><ul class="near-list">${cards}</ul></details>`;
 }).join('\n');
 save(file, marked(read(file),'directory',nav+search+groups));
 const home = t.prefix+'index.html';
 let source = read(home);
 const metadata = JSON.stringify(captions[lang]);
 if (source.includes('<!-- gallery-captions:start -->')) source=marked(source,'gallery-captions',`<script id="gallery-captions" type="application/json">${metadata}</script>`);
 else source=source.replace(/<script>\s*const galleryData/,`<!-- gallery-captions:start --><script>${metadata}</script><!-- gallery-captions:end -->\n<script>\nconst galleryData`);
 source = source.replace(/title: '(Sol|Zen|Rustic) · Photo gallery'/g,(_,name)=>`title: '${name} · ${t.gallery}'`).replace(/title: 'Kojohama · Property gallery'/g,`title: 'Kojohama · ${t.property}'`);
 source=marked(source,'gallery-data',`<script id="gallery-data" type="application/json">${JSON.stringify(galleries[lang])}</script>`);
 source = source.replace(/aria-label="Photo gallery" aria-modal/,`aria-label="${t.gallery}" aria-modal`)
  .replace(/aria-label="Close photo gallery" class="lightbox-close"/,`aria-label="${t.close}" class="lightbox-close"`)
  .replace(/aria-label="Previous photo" class="lightbox-nav/,`aria-label="${t.prev}" class="lightbox-nav`)
  .replace(/aria-label="Next photo" class="lightbox-nav/,`aria-label="${t.next}" class="lightbox-nav`);
 source=source.replace('lightboxImage.alt = `${gallery.alt} ${activeIndex + 1}`;','lightboxImage.alt = galleryCaptions[lightboxImage.getAttribute("src")] || `${gallery.alt} ${activeIndex + 1}`;')
  .replace('lightboxCaption.textContent = `${activeIndex + 1} / ${gallery.images.length}`;','lightboxCaption.textContent = `${activeIndex + 1} / ${gallery.images.length} · ${lightboxImage.alt}`;');
 source=source.replace('lightboxImage.src = `/images/${gallery.folder}/${filename}`;\n  lightboxImage.alt = galleryCaptions[lightboxImage.getAttribute("src")] || `${gallery.alt} ${activeIndex + 1}`;',
  'const photoUrl = `/images/${gallery.folder}/${filename}`;\n  window.KojohamaUI.setPhoto(lightboxImage, photoUrl, galleryCaptions[photoUrl] || `${gallery.alt} ${activeIndex + 1}`);');
 source=source.replace('activeGallery = name; activeIndex = 0; showGalleryPhoto(); lightbox.hidden = false; document.body.classList.add(\'lightbox-open\'); document.getElementById(\'lightbox-close\').focus(); setBackgroundInert(true);',
  'activeGallery = name; activeIndex = 0; showGalleryPhoto(); window.KojohamaUI.openModal(lightbox, lastGalleryTrigger); document.body.classList.add(\'lightbox-open\');');
 source=source.replace(/function setBackgroundInert\(on\) \{[^\n]+\}\s*function closeGallery\(\) \{[^\n]+\}/,
  "function closeGallery() { window.KojohamaUI.closeModal(lightbox); document.body.classList.remove('lightbox-open'); }");
 save(home,source);
 const comparison=t.prefix+'cabins/index.html';
 let compareSource=read(comparison);
 const table=`<section class="wrap cabin-comparison"><h2>${t.compare}</h2><div class="comparison-scroll"><table><caption class="sr-only">${t.compare}</caption><thead><tr><th scope="col">${t.cabin}</th><th scope="col">${t.guests}</th><th scope="col">${t.beds}</th><th scope="col">${t.book}</th></tr></thead><tbody>${facts.cabins.map(c=>`<tr><th scope="row"><a href="/${t.prefix}cabins/ocean-stay-${c.id}/">${c.name}</a></th><td>${c.maxGuests}</td><td>${c.beds}</td><td><a href="${c.airbnb}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">Airbnb</a> · <a href="${c.ctrip}" target="_blank" rel="noopener" data-cabin-name="${c.name}" data-link-location="comparison">${lang==='zh-CN'?'携程':'Ctrip'}</a></td></tr>`).join('')}</tbody></table></div></section>`;
 if (compareSource.includes('<!-- comparison:start -->')) compareSource=marked(compareSource,'comparison',table);
 else compareSource=compareSource.replace('<section class="cards wrap">',`<!-- comparison:start -->${table}<!-- comparison:end --><section class="cards wrap">`);
 save(comparison,compareSource);
}

// Keep photographed subjects and pricing notes consistent on every static page.
function walk(dir) {
 return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => {
  if (entry.name.startsWith('.') || ['data','scripts','docs','node_modules'].includes(entry.name)) return [];
  const file=path.join(dir,entry.name);
  return entry.isDirectory() ? walk(file) : entry.name.endsWith('.html') ? [file] : [];
 });
}
for (const absolute of walk(root)) {
 const file=path.relative(root,absolute).split(path.sep).join('/');
 const lang=file.startsWith('ja/')?'ja':file.startsWith('zh-cn/')?'zh-CN':'en';
 let source=read(file);
 // Production analytics stays off local and staging previews.
 source=source.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g,(whole,start,code,end)=>{
  if (!code.includes("})(window,document,'script','dataLayer'") || code.includes('location.hostname')) return whole;
  return start+"if (['kojohamacabins.jp','www.kojohamacabins.jp'].includes(location.hostname)) {"+code+'}'+end;
 });
 const trip=travelCopy[lang];
 source=source.replace(/<a\b[^>]*href="https:\/\/www\.booking\.com\/hotel\/jp\/ocean-stay\.html[^>]*>/g,tag=>{
  tag=tag.replace(/\sdata-(?:intent|link-location|cabin-name)="[^"]*"/g,'');
  return tag.replace(/>$/, ' data-intent="reviews" data-link-location="reviews" data-cabin-name="All cabins">');
 });
 const p = policy[lang];
 if(file.endsWith('faq/index.html') || /cabins\/ocean-stay-(sol|zen|rustic)\/index\.html$/.test(file)) {
  const content=`<section class="facts wrap family-policy" id="family-policy"><h2>${p.title}</h2><h3>${p.childQuestion}</h3><p>${p.childAnswer}</p><h3>${p.bbqQuestion}</h3><p>${p.bbqAnswer}</p><a href="/${locales[lang].prefix}bbq/">${p.details}</a></section>`;
  if(source.includes('<!-- family-policy:start -->'))source=marked(source,'family-policy',content);
  else source=source.replace('</main>',`<!-- family-policy:start -->${content}<!-- family-policy:end --></main>`);
  source=source.replace(/(<dt>BBQ<\/dt>\s*<dd>)[\s\S]*?(<\/dd>)/g,`$1${p.bbqAnswer} <a href="/${locales[lang].prefix}bbq/">${p.details} →</a>$2`);
 }
 if (file.endsWith('work-remotely/index.html')) {
  const workspaceText={
   en:['A place to open your laptop','Sol’s counter and Rustic’s dining area are shown below. These are everyday living spaces. If a dedicated desk, a particular chair or other work equipment matters to you, ask us before booking.'],
   ja:['パソコンを広げる場所','下の写真はSolのカウンターとRusticのダイニングです。日常の生活スペースとしてご利用いただけます。専用デスク、特定の椅子、その他のお仕事用の設備が必要な場合は、ご予約前にお問い合わせください。'],
   'zh-CN':['打开电脑的空间','下方照片展示Sol的台面和Rustic的餐桌区。这些属于日常生活空间。如果您需要专用书桌、特定座椅或其他办公设备，请在预订前联系我们。']
  }[lang];
  const workspace=`<section class="gallery-section wrap" id="workspace"><h2>${workspaceText[0]}</h2><p>${workspaceText[1]}</p><div class="photo-grid">${['/images/sol/sol-kitchen-counter.webp','/images/rustic/rustic-7.webp'].map(src=>`<img src="${src}" alt="${escape(captions[lang][src])}" width="1600" height="1067" loading="lazy" decoding="async">`).join('')}</div></section>`;
  if (source.includes('<!-- workspace:start -->')) source=marked(source,'workspace',workspace);
  else source=source.replace(/(<section class="section-block wrap">[\s\S]*?<\/section>)/,`$1<!-- workspace:start -->${workspace}<!-- workspace:end -->`);
 }
 if (file.endsWith('location/index.html')) {
  source=source.replace(/(<tr><td>(?:New Chitose Airport|新千歳空港|新千岁机场)<\/td><td>)[^<]+(<\/td>)/,`$1${trip.airport}$2`)
   .replace(/(<tr><td>Casa Antonio[^<]*<\/td><td>)[^<]+(<\/td>)/,`$1${trip.casa}$2`);
 }
 if (file.endsWith('faq/index.html')) {
  for (const kind of ['airport','casa']) {
   const question=trip[`${kind}Question`].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   source=source.replace(new RegExp(`(<h3>${question}<\\/h3>)<p>[\\s\\S]*?<\\/p>`),`$1<p>${trip[`${kind}Answer`]}</p>`);
  }
  if (lang==='zh-CN') {
   const faq=`<section class="section-block wrap"><h2>机场与札幌行程</h2><div class="compact-grid">${['airport','casa'].map(kind=>`<article><h3>${trip[`${kind}Question`]}</h3><p>${trip[`${kind}Answer`]}</p></article>`).join('')}</div></section>`;
   if (source.includes('<!-- travel-faq:start -->')) source=marked(source,'travel-faq',faq);
   else source=source.replace('<section class="season-callout">',`<!-- travel-faq:start -->${faq}<!-- travel-faq:end --><section class="season-callout">`);
  }
 }
 // Mark the owner-approved narrative ranges so later changes regenerate cleanly.
 if (/^(?:ja\/|zh-cn\/)?(?:index\.html|location\/index\.html|work-remotely\/index\.html)$/.test(file)) {
  if (!source.includes('data-travel="casa-antonio"')) source=source.replace(lang==='en'?'80–90 minutes south':lang==='ja'?'80〜90分南下':'80–90分钟来到海边',match=>`<span data-travel="casa-antonio">${trip.casa}</span>`+match.slice(lang==='en'?'80–90 minutes'.length:lang==='ja'?'80〜90分'.length:'80–90分钟'.length));
  if (file.endsWith('work-remotely/index.html')&&!source.includes('data-travel="airport"')) source=source.replace(lang==='en'?'60–80 minutes':lang==='ja'?'60〜80分':'60–80分钟',`<span data-travel="airport">${trip.airport}</span>`);
 }
 source=source.replace(/(<span data-travel="airport">)[\s\S]*?(<\/span>)/g,`$1${trip.airport}$2`).replace(/(<span data-travel="casa-antonio">)[\s\S]*?(<\/span>)/g,`$1${trip.casa}$2`);
 if (lang !== 'en') source=source.replace(/aria-label="Close reservation menu"/g,`aria-label="${lang==='ja'?'予約メニューを閉じる':'关闭预订菜单'}"`).replace(/aria-label="Primary"/g,`aria-label="${lang==='ja'?'メインナビゲーション':'主导航'}"`).replace(/aria-label="Language"/g,`aria-label="${lang==='ja'?'言語':'语言'}"`);
 source=source.replace(/<img\b[^>]*>/g,tag=>{
  const src=tag.match(/\bsrc="([^"]+)"/)?.[1];
  if(captions[lang][src])tag=tag.replace(/\balt="[^"]*"/,`alt="${escape(captions[lang][src])}"`);
  const variants=responsive[src];
  if(variants){
   tag=tag.replace(/\s(?:srcset|data-full-src)="[^"]*"/g,'');
   const sizes=tag.includes('sizes=')?'':' sizes="(max-width:700px) calc(100vw - 40px), 480px"';
   tag=tag.replace(/\s*\/?>$/,` srcset="${escape(variants.srcset)}" data-full-src="${escape(src)}"${sizes}>`);
  }
  return tag;
 });
 if (source.includes('<!-- pricing:start -->')) source=marked(source,'pricing',`<p class="pricing-note wrap">${pricingCopy[lang]}</p>`);
 source=source.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(_,start,text,end)=>{
  const schema=JSON.parse(text);
  const update=node=>{
   if (!node || typeof node !== 'object') return;
   if (node['@type']==='LodgingBusiness' && node.priceRange) node.priceRange=pricingCopy[lang];
   if (node['@type']==='FAQPage' && file.endsWith('faq/index.html') && lang==='zh-CN') {
    for (const kind of ['airport','casa']) if (!node.mainEntity.some(q=>q.name===trip[`${kind}Question`])) node.mainEntity.push({'@type':'Question',name:trip[`${kind}Question`],acceptedAnswer:{'@type':'Answer',text:trip[`${kind}Answer`]}});
   }
   if(node['@type']==='FAQPage' && file.endsWith('faq/index.html')) for(const kind of ['child','bbq']){
    const name=p[`${kind}Question`],answer=p[`${kind}Answer`];
    const existing=node.mainEntity.find(q=>q.name===name);
    if(existing)existing.acceptedAnswer.text=answer;
    else node.mainEntity.push({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text:answer}});
   }
   if (node['@type']==='Question') for (const kind of ['airport','casa']) if (node.name===trip[`${kind}Question`]) node.acceptedAnswer.text=trip[`${kind}Answer`];
   if (node['@type']==='Answer' && typeof node.text==='string' && node.text.includes('19,800')) node.text=pricingCopy[lang];
   Object.values(node).forEach(update);
  };
  update(schema);
  return start+JSON.stringify(schema)+end;
 });
 // The preload and visible hero must select the same responsive resource.
 const hero=source.match(/<img\b[^>]*class="hero-img"[^>]*>/)?.[0];
 if(hero){
  const attr=name=>hero.match(new RegExp('\\b'+name+'="([^"]+)"'))?.[1];
  source=source.replace(/<link\b[^>]*rel="preload"[^>]*>/g,tag=>{
   if(!tag.includes('as="image"'))return tag;
   return '<link as="image" href="'+attr('src')+'" imagesizes="'+attr('sizes')+'" imagesrcset="'+attr('srcset')+'" fetchpriority="high" rel="preload"/>';
  });
 }
 save(file,layouts.render(source,file,lang));
}
assets.build();
require('./sitemaps.cjs').sync();
console.log('Synchronized localized directory, photo captions and cabin comparison sections.');
