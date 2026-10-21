const terms='https://claude.ai/artifact/VwbhrcEnRHqpa7oXJ26VBZ#8b0898b8-46db.mkdxr3358wj.9437';
const manuals='https://drive.google.com/drive/folders/1U1lNCRs2jV1X4tpmXBhH1_xBtm0WPdVH?usp=drive_link';
const copy={
 en:{title:'Before you arrive',terms:'Accommodation terms and house rules',manuals:'House manuals — Sol, Zen and Rustic',guide:'Open the companion guest guide',note:'Please read the terms and your cabin’s manual before arrival. The terms take effect on 1 November 2026; the Japanese text is the original. Check-in remains 14:00 for Zen and 15:00 for Sol/Rustic; checkout is by 10:00. Your booking platform’s cancellation and payment conditions take priority.'},
 ja:{title:'ご到着前に',terms:'宿泊約款・ハウスルール',manuals:'ハウスマニュアル — Sol・Zen・Rustic',guide:'コンパニオンゲストガイドを開く',note:'ご到着前に約款とご宿泊棟のマニュアルをご確認ください。約款は2026年11月1日施行、日本語が正文です。チェックインはZenが14時、Sol・Rusticが15時から、チェックアウトは10時までです。予約サイトのキャンセル・支払条件が優先します。'},
 'zh-CN':{title:'抵达前请阅读',terms:'住宿条款与住宿规则',manuals:'住宿手册 — Sol、Zen、Rustic',guide:'打开住客指南',note:'请在抵达前阅读条款及所订小屋的手册。条款自2026年11月1日起施行，以日文为正文。Zen入住时间为14:00起，Sol/Rustic为15:00起，退房须在10:00前。预订平台的取消及支付条件优先适用。'}
};
exports.render=lang=>{const t=copy[lang]; return `<section class="wrap section-block" id="guest-documents"><h2>${t.title}</h2><p>${t.note}</p><ul><li><a href="${terms}" target="_blank" rel="noopener noreferrer">${t.terms}</a></li><li><a href="${manuals}" target="_blank" rel="noopener noreferrer">${t.manuals}</a></li><li><a href="https://guide.kojohamacabins.jp/">${t.guide}</a></li></ul></section>`;};
