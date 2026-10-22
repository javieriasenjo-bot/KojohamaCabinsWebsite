const terms="https://docs.google.com/document/d/1qwA727D--mHlmTGMXojN7foF3o2zXGar/preview";
const finalPolicy=require("../data/terms-policy.json");
const manuals=[['Sol','1ZMMTkKGAzmrbG3VMQKLcXbZFLGIDsZJV'],['Zen','15L3R_M30Fixeoo5rLZObskAtng43VL31'],['Rustic','1GwUMJ-CsqbMLFMojTg4MV-M2SpTgWgP5']];
const copy={
 en:{title:'Before you arrive',terms:'Accommodation terms and house rules',manuals:'House manuals — Sol, Zen and Rustic',guide:'Open the companion guest guide',note:"Final terms apply from 1 November 2026; Japanese is the original. Owner-confirmed check-in: Zen 14:00; Sol and Rustic 15:00. Checkout by 10:00. Your booking platform’s cancellation, payment and refund conditions take priority."},
 ja:{title:'ご到着前に',terms:'宿泊約款・ハウスルール',manuals:'ハウスマニュアル — Sol・Zen・Rustic',guide:'コンパニオンゲストガイドを開く',note:"最終約款は2026年11月1日施行、日本語が正文です。オーナー確認済みのチェックインはZen 14時、Sol・Rustic 15時から、チェックアウトは10時までです。キャンセル・支払・返金条件は予約サイトの規定が優先します。"},
 'zh-CN':{title:'抵达前请阅读',terms:'住宿条款与住宿规则',manuals:'住宿手册 — Sol、Zen、Rustic',guide:'打开住客指南',note:"最终条款自2026年11月1日起施行，以日文为正文。业主确认入住时间：Zen 14:00，Sol和Rustic 15:00；10:00前退房。取消、付款及退款以预订平台的规则为准。"}
};
exports.render=lang=>{const t=copy[lang]; const p=finalPolicy.copy[lang === "zh-CN" ? "zh" : lang]; return `<section class="wrap section-block" id="guest-documents"><h2>${t.title}</h2><p>${p.note}</p><details><summary>${t.terms}</summary><ul>${p.items.map(item=>`<li>${item}</li>`).join("")}</ul></details><ul><li><a href="${terms}" target="_blank" rel="noopener noreferrer">${t.terms}</a></li><li>${t.manuals}: ${manuals.map(([cabin,id])=>`<a href="https://drive.google.com/file/d/${id}/view" target="_blank" rel="noopener noreferrer">${cabin} PDF</a>`).join(' · ')}</li><li><a href="https://guide.kojohamacabins.jp/">${t.guide}</a></li></ul></section>`;};
