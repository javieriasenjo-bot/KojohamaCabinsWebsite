const facts = require('../data/site-facts.json').wifi;
const copy = {
 en: ['Measured Wi-Fi speeds · 13 October 2026', 'Cabin', 'Band', 'Download (Mbps)', 'Upload (Mbps)', 'Latency (ms)', 'Phone tests using Google’s internet speed test. Results vary with device, room, signal and network load; speeds are not guaranteed.'],
 ja: ['Wi-Fi実測値 · 2026年10月13日', 'キャビン', '周波数帯', '下り (Mbps)', '上り (Mbps)', '遅延 (ms)', 'スマートフォンでGoogleの速度テストを使用。端末、室内の場所、電波状況、回線の混雑により速度は変わります。保証値ではありません。'],
 'zh-CN': ['Wi-Fi实测速度 · 2026年10月13日', '小屋', '频段', '下载 (Mbps)', '上传 (Mbps)', '延迟 (ms)', '手机使用Google网络速度测试。速度因设备、房间位置、信号和网络负载而变化，并非保证值。']
};
function render(lang, cabin) {
 const t = copy[lang];
 const entries = Object.entries(facts.measurements).filter(([id]) => !cabin || id === cabin);
 const rows = entries.flatMap(([id, bands]) => ['2.4', '5'].map(band => {
  const v = bands[band];
  return `<tr><th scope="row">${id[0].toUpperCase()+id.slice(1)}</th><td>${band} GHz</td><td>${v.downloadMbps.toFixed(1)}</td><td>${v.uploadMbps.toFixed(1)}</td><td>${v.latencyMs}</td></tr>`;
 })).join('');
 return `<section class="wrap section-block" id="wifi-measurements"><h2>${t[0]}</h2><div style="overflow-x:auto"><table><caption>${t[0]}</caption><thead><tr>${t.slice(1,6).map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><p class="note">${t[6]}</p></section>`;
}
module.exports = { render };
