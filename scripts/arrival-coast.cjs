const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const facts = JSON.parse(fs.readFileSync(path.join(root, 'data/site-facts.json'), 'utf8'));
const copy = {
 en: {
  arrival: 'Check-in: from 15:00 for all cabins. Checkout is by 10:00 for all three cabins. Self-checkout is possible earlier at any hour. Check the arrival window on our direct booking website.',
  title: 'Sea views and local outings',
  coast: 'The sea water in Kojohama is very cold throughout the year and it is not advisable to swim or surf in it. Please, follow the local regulations carefully. We strongly recommend you enjoy the nearby Onsens if you feel like going for a bath, instead of entering the sea.',
  local: 'The beach is a 30-second walk from every cabin. Ayoro Onsen is 290 m away, about a four-minute walk. Kojohama Cafe is around 100 m away, about one minute on foot. Other onsens, restaurants and local food shops are within walking distance. Onsen entry is paid separately, and business hours vary. Sanlaiva Ski Resort is approximately 25–30 minutes by car; allow extra time in snow or ice and check the resort’s seasonal opening, rentals and lessons.',
  equipment: 'Every cabin has a portable induction stove, pots and pans, toaster, rice cooker, microwave with oven function, kitchenware and children’s tableware. A washer, laundry detergent, clothes drying rack, towels and bath toiletries are provided. Zen alone has a tatami living room and a winter kotatsu. Every cabin has the same beds: one double bed and three single beds in a bunk layout, for up to five guests.',
 },
 ja: {
  arrival: 'チェックインは全棟15:00から。全棟のチェックアウトは10:00までです。それより早い時間のセルフチェックアウトはいつでも可能です。到着可能な時間帯は直接予約サイトでご確認ください。',
  title: '海辺での過ごし方と周辺のお出かけ',
  coast: '虎杖浜の海水は一年を通してとても冷たく、海での遊泳やサーフィンはおすすめできません。現地の規則を必ずお守りください。海に入るのではなく、近くの温泉でゆっくり入浴されることを強くおすすめします。',
  local: '全棟、ビーチまで徒歩30秒です。アヨロ温泉まで290m、徒歩約4分。虎杖浜カフェまでは約100m、徒歩約1分です。ほかの温泉や食事処、食品店も徒歩圏内にあります。温泉の入浴料は別途必要で、営業日・営業時間は施設ごとに異なります。サンライバスキー場へは車で約25〜30分が目安。積雪・凍結時は余裕を持ち、営業期間、レンタルやレッスンはスキー場へご確認ください。',
  equipment: '全棟に卓上IHコンロ、鍋・フライパン、トースター、炊飯器、オーブン機能付き電子レンジ、食器、子ども用食器を備えています。洗濯機、洗濯洗剤、物干し、タオル、浴室用品もご用意。畳のリビングと冬のこたつがあるのはZenのみです。寝具は全棟共通で、ダブルベッド1台とシングルベッド3台（二段ベッド式）、定員は最大5名です。',
 },
 'zh-CN': {
  arrival: '三栋均下午3点起入住；三栋均须在上午10点前退房。如需提早离开，可在此前任何时间自助退房。抵达时段请以直接预订网站显示的信息为准。',
  title: '海边散步与周边游览',
  coast: '虎杖浜的海水全年都非常寒冷，不建议在海中游泳或冲浪。请务必遵守当地规定。如果想泡澡，我们强烈建议您前往附近的温泉，而不是下海。',
  local: '三栋小屋步行30秒即可到达海滩。アヨロ温泉（Ayoro Onsen）距小屋290米，步行约4分钟；虎杖浜咖啡馆约100米，步行约1分钟。步行范围内还有其他温泉、餐馆和食品店。温泉入浴费另付，各店营业日和时间不同。Sanlaiva滑雪场通常约25–30分钟车程，积雪或结冰时请多留时间，并向雪场确认开放日期、装备租借和课程安排。',
  equipment: '三栋均提供便携式电磁炉、锅具和平底锅、烤面包机、电饭煲、带烤箱功能的微波炉、餐具及儿童餐具，还备有洗衣机、洗衣液、晾衣架、毛巾和洗浴用品。只有Zen设有榻榻米客厅和冬季暖桌。三栋床位相同：1张双人床＋3张单人床（上下铺式），每栋最多入住5人。',
 },
};
function sync() {
 for (const [lang, c] of Object.entries(copy)) {
  const prefix = lang === 'en' ? '' : lang === 'ja' ? 'ja/' : 'zh-cn/';
  for (const route of ['index.html','faq/index.html','location/index.html','cabins/index.html',...facts.cabins.map(c => `cabins/ocean-stay-${c.id}/index.html`)]) {
   const file = path.join(root,prefix,route); let html = fs.readFileSync(file,'utf8');
   const cabin = route.match(/ocean-stay-(sol|zen|rustic)/)?.[1]; const time = cabin ? '15:00' : null;
   html = html.replace(/Check-in is from 16:00 until 02:00 the next morning\. Check-out is by 10:00\.|Check-in is from 4 PM to 2 AM and checkout is before 10 AM\.|Check-in 16:00–02:00, check-out by 10:00\.|チェックインは16:00から翌2:00まで、チェックアウトは10:00までです。|チェックイン16:00〜翌2:00、チェックアウト10:00まで。|入住时间为16:00至次日2:00，退房须在10:00前。|入住 16:00 至次日 2:00，退房 10:00 前。/g,c.arrival);
   html = html.replace(/(<strong>Check-in<\/strong><span>)4:00 PM–2:00 AM/g,`$1${time ? '3:00 PM–2:00 AM' : 'All cabins: 3 PM'}`);
   html = html.replace(/(<strong>チェックイン<\/strong><span>)16:00〜翌2:00/g,`$1${time ? time+'〜翌2:00' : '全棟 15:00〜'}`);
   html = html.replace(/(<strong>入住<\/strong><span>)下午4:00至凌晨2:00/g,`$1${time ? '下午3:00至次日凌晨2:00' : '所有小屋下午3点起'}`);
   html = html.replace('Check-in: 4 PM–2 AM','Check-in: from 3 PM for all cabins').replace('入住：16:00–次日2:00','入住：所有小屋下午3点起');
   html = html.replace(/"checkinTime":"16:00"/g,`"checkinTime":"${time || '15:00'}"`);
   const block=`<!-- arrival-coast:start --><section class="section-block wrap" id="arrival-coast"><h2>${c.title}</h2><p>${c.arrival}</p><p>${c.local}</p><p>${c.equipment}</p><p>${c.coast}</p></section><!-- arrival-coast:end -->`;
   html = html.includes('<!-- arrival-coast:start -->') ? html.replace(/<!-- arrival-coast:start -->[\s\S]*?<!-- arrival-coast:end -->/,block) : html.replace('</main>',block+'</main>');
   fs.writeFileSync(file,html);
  }
 }
}
module.exports = { sync };
if (require.main === module) sync();
