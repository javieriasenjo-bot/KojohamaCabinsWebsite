const message = file => file.startsWith('ja/') ? '料金・空室状況・宿泊条件は各予約サイトでご確認ください。' : file.startsWith('zh-cn/') ? '请在各预订平台查看最新房价、空房及入住条件。' : 'Check current prices, availability and stay conditions on your preferred booking platform.';
function clean(source,file){
 const note=message(file);
 for(const name of ['seasonal-rates','date-check']) source=source.replace(new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`,'g'),`<!-- ${name}:start --><!-- ${name}:end -->`);
 source=source.replace(/<!-- pricing:start -->[\s\S]*?<!-- pricing:end -->/g,`<!-- pricing:start --><p class="wrap pricing-note">${note}</p><!-- pricing:end -->`);
 source=source.replace(/<tr>\s*<th scope="row">[^<]*(?:2026|清掃|清洁)[\s\S]*?<\/tr>/g,'');
 source=source.replace(/<li><strong>[^<]*¥[\s\S]*?<\/li>/g,'');
 source=source.replace(/<a\b[^>]*href="[^"]*#(?:seasonal-rates|check-dates)"[^>]*>[\s\S]*?<\/a>/g,'');
 source=source.replace(/<h3>[^<]*13,800[^<]*<\/h3><p>[\s\S]*?<\/p>/g,`<h3>${file.startsWith('ja/')?'ご予約':file.startsWith('zh-cn/')?'预订住宿':'Plan your stay'}</h3><p>${note}</p>`);
 source=source.replace(/<(p|span)\b([^>]*)>([^<]*(?:13,800|7,000|2,500)[\s\S]*?)<\/\1>/g,`<p>${note}</p>`);
 source=source.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,json)=>{const obj=JSON.parse(json);function walk(v){if(!v||typeof v!=='object')return;delete v.offers;delete v.priceRange;for(const k of Object.keys(v)){if(typeof v[k]==='string'&&/13,800|7,000|2,500/.test(v[k]))v[k]=note;else walk(v[k]);}}walk(obj);return '<script type="application/ld+json">'+JSON.stringify(obj)+'</script>';});
 source=source.replace(/<meta\b[^>]*>/g, tag=>tag.replace(/content="[^"]*(?:13,800|7,000|2,500)[^"]*"/g,'content="'+note+'"'));
 return source;
}
module.exports={clean};
