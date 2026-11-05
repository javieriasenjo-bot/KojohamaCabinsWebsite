// Neutral wording used wherever rates used to appear.
const note = file => file.startsWith('ja/') ? '料金・空室状況・宿泊条件は各予約サイトでご確認ください。' : file.startsWith('zh-cn/') ? '请在各预订平台查看最新房价、空房及入住条件。' : 'Check current prices, availability and stay conditions on your preferred booking platform.';
module.exports = { note };
