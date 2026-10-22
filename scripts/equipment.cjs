// Kitchen equipment photographed 20 October 2026. sol-1360 is a living-room bench
// and window, and rustic-1397 is a futon on tatami. Neither belongs in this grid:
// only Zen has tatami, so rustic-1397 must not be captioned as a Rustic room.
const photos = {
  sol: ['sol-1364', 'sol-1369'],
  zen: ['zen-1392', 'zen-1393', 'zen-1384'],
  rustic: ['rustic-1409', 'rustic-1404']
};
const alts = {
  en: {
    'sol-1364': 'Saucepan with a glass lid, black stockpot with a stainless lid, black frying pan and a mesh strainer on a cabinet shelf, beside a bin labeled Extra Dishes.',
    'sol-1369': 'Drawer of forks, spoons, knives and chopsticks, with a whisk, kitchen scissors and a wooden spatula.',
    'zen-1392': 'Large black stockpot with a stainless-steel lid.',
    'zen-1393': 'Black frying pan in front, with a colander and saucepans stacked behind.',
    'zen-1384': 'Drawer of chopsticks, forks, a whisk, peeler, tongs, rice paddle and scissors.',
    'rustic-1409': 'Small frying pan, a saucepan with a glass lid, and a larger pot with a stainless lid.',
    'rustic-1404': 'Drawer of knives, forks, spoons and chopsticks.'
  },
  ja: {
    'sol-1364': 'ガラス蓋の片手鍋、ステンレス蓋の黒い寸胴鍋、黒いフライパンとざる。棚の上にあり、Extra Dishesと書かれた収納のそばです。',
    'sol-1369': 'フォーク、スプーン、ナイフ、箸の引き出し。泡立て器、キッチンバサミ、木べらも入っています。',
    'zen-1392': 'ステンレスの蓋が付いた大きな黒い寸胴鍋。',
    'zen-1393': '手前に黒いフライパン、奥にざると重ねた片手鍋。',
    'zen-1384': '箸、フォーク、泡立て器、ピーラー、トング、しゃもじ、はさみの引き出し。',
    'rustic-1409': '小さめのフライパン、ガラス蓋の片手鍋、ステンレス蓋の大きめの鍋。',
    'rustic-1404': 'ナイフ、フォーク、スプーン、箸の引き出し。'
  },
  'zh-CN': {
    'sol-1364': '带玻璃盖的单柄锅、带不锈钢盖的黑色高汤锅、黑色煎锅和滤网，放在柜架上，旁边是标有 Extra Dishes 的收纳箱。',
    'sol-1369': '抽屉里有叉子、勺子、刀和筷子，另有打蛋器、厨房剪刀和木铲。',
    'zen-1392': '带不锈钢盖的大号黑色高汤锅。',
    'zen-1393': '前方是黑色煎锅，后方叠放着滤锅和单柄锅。',
    'zen-1384': '抽屉里有筷子、叉子、打蛋器、削皮器、夹子、饭勺和剪刀。',
    'rustic-1409': '小号煎锅、带玻璃盖的单柄锅，以及带不锈钢盖的较大锅。',
    'rustic-1404': '抽屉里有刀、叉子、勺子和筷子。'
  }
};
const copy = {
  en: {
    title: 'Kitchen equipment photographed on 20 October 2026',
    body: 'Pots, frying pans, cutlery and crockery are supplied. The owner tested all supplied pots and pans on the cabin’s induction hob on 20 October 2026. Dish drying racks are not yet provided.',
    zen: ' Zen also has extra cooking gear intended for Japanese-style meals.'
  },
  ja: {
    title: '2026年10月20日撮影のキッチン用品',
    body: '鍋、フライパン、カトラリー、食器を備えています。2026年10月20日、オーナーが各棟のIHコンロですべての備え付けの鍋・フライパンの動作を確認しました。食器用の水切りラックはまだありません。',
    zen: ' Zenには和食の調理向けの追加用品も備えています。'
  },
  'zh-CN': {
    title: '2026年10月20日拍摄的厨房用品',
    body: '提供锅、煎锅、刀叉和餐具。业主于2026年10月20日在各栋的电磁炉上测试了所有配备的锅和煎锅，确认可以使用。目前尚未提供餐具沥水架。',
    zen: ' Zen还配有适合日式餐食的额外烹饪用品。'
  }
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));
function media(id) {
  const file = `/images/equipment-2026-10/${id}.webp`;
  if (!require('node:fs').existsSync(require('node:path').join(__dirname, '..', file.slice(1)))) throw new Error('Missing equipment photo ' + id);
  return file;
}
function render(lang, cabin) {
  const text = copy[lang];
  const images = photos[cabin].map(id => `<img src="${media(id)}" alt="${escape(alts[lang][id])}" loading="lazy" decoding="async">`).join('');
  return `<section class="gallery-section wrap"><h2>${text.title}</h2><p>${text.body}${cabin === 'zen' ? text.zen : ''}</p><div class="photo-grid">${images}</div></section>`;
}
module.exports = {render};
