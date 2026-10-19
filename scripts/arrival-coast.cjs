const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const facts = JSON.parse(fs.readFileSync(path.join(root, 'data/site-facts.json'), 'utf8'));
const copy = {
 en: {
  arrival: 'Check-in: Zen from 14:00; Sol and Rustic from 15:00. Checkout is by 10:00 for all three cabins. Self-checkout is possible earlier at any hour. Check the arrival window on your booking platform.',
  title: 'Sea views, shore fishing and local outings',
  coast: 'The sea directly outside the cabins is not for swimming or entering the water at any time of year. Enjoy shore walks and rod-and-line fishing, including surf casting and lure fishing, only where local rules permit. Follow species, season and area restrictions, posted notices, weather and sea conditions. Do not collect shellfish, sea urchins, crabs or seaweed; fishing rights and local regulations apply. Fishing equipment is not available for rent. Surfing is only for permitted local spots after checking regulations, access rules and sea conditions; seeing other surfers does not establish that a spot is safe or permitted.',
  local: 'Ayoro Onsen is 290 m away, about a four-minute walk. Kojohama Cafe is around 100 m away, about one minute on foot. Other onsens, restaurants and local food shops are within walking distance. Onsen entry is paid separately, and business hours vary. Sanlaiva Ski Resort is approximately 25–30 minutes by car; allow extra time in snow or ice and check the resort’s seasonal opening, rentals and lessons.',
  equipment: 'Every cabin has a portable induction stove, pots and pans, toaster, rice cooker, microwave with oven function, kitchenware and children’s tableware. A washer, laundry detergent, clothes drying rack, towels and bath toiletries are provided. Zen alone has a tatami living room, a winter kotatsu and an optional living-room futon, within its five-guest cap.',
 },
 ja: {
  arrival: 'チェックインはZenが14:00から、SolとRusticが15:00から。全棟のチェックアウトは10:00までです。それより早い時間のセルフチェックアウトはいつでも可能です。到着可能な時間帯はご予約されたサイトでご確認ください。',
  title: '海辺での過ごし方と周辺のお出かけ',
  coast: 'コテージの目の前の海では、季節を問わず遊泳や海への立ち入りはできません。浜辺の散策や竿と糸を使った釣り（投げ釣り・ルアー釣りなど）は、地域のルールで認められた場所・方法でお楽しみください。魚種、時期、区域の規制や現地の掲示を守り、天候・海況をご確認ください。貝類、ウニ、カニ、海藻は採らないでください。漁業権や地域の規制が適用されます。釣り道具の貸し出しはありません。サーフィンは地域の規制、立ち入りルール、天候・海況を確認し、認められた場所でのみ行ってください。他の方が海に入っていても、安全や許可を保証するものではありません。',
  local: 'アヨロ温泉まで290m、徒歩約4分。虎杖浜カフェまでは約100m、徒歩約1分です。ほかの温泉や食事処、食品店も徒歩圏内にあります。温泉の入浴料は別途必要で、営業日・営業時間は施設ごとに異なります。サンライバスキー場へは車で約25〜30分が目安。積雪・凍結時は余裕を持ち、営業期間、レンタルやレッスンはスキー場へご確認ください。',
  equipment: '全棟に卓上IHコンロ、鍋・フライパン、トースター、炊飯器、オーブン機能付き電子レンジ、食器、子ども用食器を備えています。洗濯機、洗濯洗剤、物干し、タオル、浴室用品もご用意。畳のリビング、冬のこたつ、リビングで使える予備の布団があるのはZenのみです。Zenも定員は最大5名です。',
 },
 'zh-CN': {
  arrival: 'Zen下午2点起入住，Sol和Rustic下午3点起入住；三栋均须在上午10点前退房。如需提早离开，可在此前任何时间自助退房。抵达时段请以预订平台显示的信息为准。',
  title: '海边散步、岸钓与周边游览',
  coast: '小屋正前方的海域全年禁止游泳和下水。可在当地规定允许的地点沿岸散步，用鱼竿和鱼线钓鱼，包括远投和路亚钓。请遵守鱼种、季节、区域限制及现场告示，并留意天气和海况。请勿采集贝类、海胆、螃蟹或海藻；当地渔业权及其他规定同样适用。我们不提供钓具租借。冲浪须先确认当地规定、出入限制、天气和海况，仅在允许的地点进行。看到其他人下水，并不代表该处允许下水或适合游玩。',
  local: 'アヨロ温泉（Ayoro Onsen）距小屋290米，步行约4分钟；虎杖浜咖啡馆约100米，步行约1分钟。步行范围内还有其他温泉、餐馆和食品店。温泉入浴费另付，各店营业日和时间不同。Sanlaiva滑雪场通常约25–30分钟车程，积雪或结冰时请多留时间，并向雪场确认开放日期、装备租借和课程安排。',
  equipment: '三栋均提供便携式电磁炉、锅具和平底锅、烤面包机、电饭煲、带烤箱功能的微波炉、餐具及儿童餐具，还备有洗衣机、洗衣液、晾衣架、毛巾和洗浴用品。只有Zen设有榻榻米客厅、冬季暖桌及可在客厅使用的日式床褥；总入住人数仍不超过5人。',
 },
};
function sync() {
 for (const [lang, c] of Object.entries(copy)) {
  const prefix = lang === 'en' ? '' : lang === 'ja' ? 'ja/' : 'zh-cn/';
  for (const route of ['index.html','faq/index.html','location/index.html','cabins/index.html',...facts.cabins.map(c => `cabins/ocean-stay-${c.id}/index.html`)]) {
   const file = path.join(root,prefix,route); let html = fs.readFileSync(file,'utf8');
   const cabin = route.match(/ocean-stay-(sol|zen|rustic)/)?.[1]; const time = cabin === 'zen' ? '14:00' : cabin ? '15:00' : null;
   html = html.replace(/Check-in is from 16:00 until 02:00 the next morning\. Check-out is by 10:00\.|Check-in is from 4 PM to 2 AM and checkout is before 10 AM\.|Check-in 16:00–02:00, check-out by 10:00\.|チェックインは16:00から翌2:00まで、チェックアウトは10:00までです。|チェックイン16:00〜翌2:00、チェックアウト10:00まで。|入住时间为16:00至次日2:00，退房须在10:00前。|入住 16:00 至次日 2:00，退房 10:00 前。/g,c.arrival);
   html = html.replace(/(<strong>Check-in<\/strong><span>)4:00 PM–2:00 AM/g,`$1${time ? (cabin === 'zen' ? '2:00 PM' : '3:00 PM')+'–2:00 AM' : 'Zen: 2 PM; Sol/Rustic: 3 PM'}`);
   html = html.replace(/(<strong>チェックイン<\/strong><span>)16:00〜翌2:00/g,`$1${time ? time+'〜翌2:00' : 'Zen 14:00〜、Sol・Rustic 15:00〜'}`);
   html = html.replace(/(<strong>入住<\/strong><span>)下午4:00至凌晨2:00/g,`$1${time ? (cabin === 'zen'?'下午2:00':'下午3:00')+'至次日凌晨2:00' : 'Zen下午2点起；Sol、Rustic下午3点起'}`);
   html = html.replace('Check-in: 4 PM–2 AM','Check-in: Zen from 2 PM; Sol and Rustic from 3 PM').replace('入住：16:00–次日2:00','入住：Zen下午2点起；Sol、Rustic下午3点起');
   html = html.replace(/"checkinTime":"16:00"/g,`"checkinTime":"${time || '15:00'}"`);
   const block=`<!-- arrival-coast:start --><section class="section-block wrap" id="arrival-coast"><h2>${c.title}</h2><p>${c.arrival}</p><p>${c.local}</p><p>${c.equipment}</p><p>${c.coast}</p></section><!-- arrival-coast:end -->`;
   html = html.includes('<!-- arrival-coast:start -->') ? html.replace(/<!-- arrival-coast:start -->[\s\S]*?<!-- arrival-coast:end -->/,block) : html.replace('</main>',block+'</main>');
   fs.writeFileSync(file,html);
  }
 }
}
module.exports = { sync };
if (require.main === module) sync();
