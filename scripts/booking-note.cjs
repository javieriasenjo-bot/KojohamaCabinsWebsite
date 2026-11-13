// Neutral wording used wherever rates used to appear. Guests are sent to one booking page (AirHost) per language.
const facts = require('../data/site-facts.json');
const note = file => file.startsWith('ja/') ? '料金・空室状況・宿泊条件は予約ページでご確認ください。' : file.startsWith('zh-cn/') ? '请在预订页面查看最新房价、空房及入住条件。' : 'Check current prices, availability and stay conditions on our booking page.';
// lang is 'en', 'ja' or 'zh-CN' (the keys of facts.bookingUrl).
const bookingUrl = lang => facts.bookingUrl[lang];
const cta = {en: 'Check availability and book', ja: '空室を確認して予約', 'zh-CN': '查看空房并预订'};
module.exports = { note, bookingUrl, cta };
