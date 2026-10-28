// Plain-text summary for answer engines. Regenerated from approved facts.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const facts = require('../data/site-facts.json');
const yen = n => '¥' + n.toLocaleString('en-US');
function write() {
  const lines = [];
  lines.push('# Ocean Stay Kojohama');
  lines.push('> Three private oceanfront cabins beside the Pacific in Kojohama, Shiraoi, Hokkaido, Japan. Near Noboribetsu and Upopoy.');
  lines.push('');
  lines.push('Canonical: https://kojohamacabins.jp/');
  lines.push('English: https://kojohamacabins.jp/');
  lines.push('日本語: https://kojohamacabins.jp/ja/');
  lines.push('简体中文: https://kojohamacabins.jp/zh-cn/');
  lines.push('Korean and Traditional Chinese marketing pages are not published yet.');
  lines.push('In-stay guest guide (English, 日本語, 简体中文, 繁體中文; not a search landing page): https://guide.kojohamacabins.jp/');
  lines.push('');
  lines.push('## Place');
  lines.push('Published address: 595-2 Kojohama, Shiraoi, Shiraoi District, Hokkaido 059-0641, Japan.');
  lines.push('Some booking-platform labels still show Sol or Rustic as 595-1. Use 595-2 for emergencies and navigation until those records are reconciled.');
  lines.push('Email: admin@kagami-planning.com');
  lines.push('LINE: https://line.me/R/ti/p/@148rlmzm');
  lines.push('Emergency in Japan: 119 ambulance and fire; 110 police.');
  lines.push('New Chitose Airport: about ' + facts.travel.newChitoseMinutes.join('–') + ' minutes by car. Allow extra time in winter.');
  lines.push('Sister apartments in Sapporo: https://casaantonio.jp/ (about ' + facts.travel.casaAntonioMinutes.join('–') + ' minutes by car).');
  lines.push('');
  lines.push('## Cabins');
  for (const cabin of facts.cabins) {
    const extras = [cabin.tatami ? 'tatami' : null, cabin.kotatsu ? 'kotatsu' : null].filter(Boolean).join(', ');
    lines.push('- ' + cabin.name + ': up to ' + cabin.maxGuests + ' guests, ' + cabin.beds + ' beds' + (extras ? ', ' + extras : '') + '. Check-in from ' + cabin.checkIn + '. Checkout by ' + cabin.checkOut + '.');
    lines.push('  Page: https://kojohamacabins.jp/cabins/ocean-stay-' + cabin.id + '/');
    lines.push('  Book on Airbnb: ' + cabin.airbnb);
  }
  lines.push('Each cabin is an entire home with a kitchen, Wi-Fi, washer, heating, air-conditioning and one free parking space. Pets are not allowed. Smoking is not allowed. Children and infants are welcome within the five-guest cap.');
  lines.push('');
  lines.push('## Prices');
  lines.push(facts.pricing.seasonStart + ' to ' + facts.pricing.seasonEnd + ': from ' + yen(facts.pricing.fromNightlyJPY) + ' per night for up to ' + facts.pricing.baseGuests + ' guests.');
  lines.push('Cleaning is ' + yen(facts.pricing.cleaningJPY) + ' per stay and is not included. Taxes are not included.');
  lines.push('From guest ' + facts.pricing.extraGuestFrom + ', add ' + yen(facts.pricing.extraGuestJPY) + ' per person per stay.');
  lines.push('Published weekday / weekend nightly rates before cleaning and tax:');
  for (const cabin of facts.cabins) {
    const rate = facts.pricing.rates[cabin.id];
    lines.push('- ' + cabin.name + ': weekday ' + yen(rate.weekday) + ', weekend ' + yen(rate.weekend) + '.');
  }
  lines.push('Dated rates: https://kojohamacabins.jp/cabins/#seasonal-rates');
  lines.push('Availability and the final total are confirmed on Airbnb. Do not quote a stay total that is not on the booking page.');
  if (facts.bookingChannels && facts.bookingChannels.ctrip === false) lines.push('Ctrip and Trip.com are not an active booking channel on this website.');
  lines.push('');
  lines.push('## BBQ');
  lines.push(facts.bbq.allowed ? 'A ' + facts.bbq.grillProvided + ' is available by prior arrangement for ' + yen(facts.bbq.feeJPY) + ' per stay. Guests bring two compatible gas cartridges, food, utensils and other gear. Guide: https://kojohamacabins.jp/bbq/' : 'BBQ is not offered.');
  lines.push('');
  lines.push('## Useful pages');
  lines.push('- Compare cabins: https://kojohamacabins.jp/cabins/');
  lines.push('- How to get here: https://kojohamacabins.jp/location/');
  lines.push('- Area guide: https://kojohamacabins.jp/things-to-do/');
  lines.push('- FAQ: https://kojohamacabins.jp/faq/');
  lines.push('- October to March: https://kojohamacabins.jp/october-to-march/');
  lines.push('- Work remotely: https://kojohamacabins.jp/work-remotely/');
  lines.push('');
  lines.push('The same paths exist under /ja/ and /zh-cn/.');
  const text = lines.filter(line => !/13,800|7,000|2,500/.test(line)).join('\n') + '\n';
  const file = path.join(root, 'llms.txt');
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) fs.writeFileSync(file, text);
  console.log('Wrote llms.txt');
}
module.exports = { write };
if (require.main === module) write();
