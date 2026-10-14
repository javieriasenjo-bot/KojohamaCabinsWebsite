const { copy } = require('../data/guest-charges.json');
function render(lang) {
 const t = copy[lang];
 return `<section class="wrap section-block" id="guest-charges"><h2>${t.title}</h2><ul>${t.items.map(x=>`<li>${x}</li>`).join('')}</ul><p class="note">${t.note}</p></section>`;
}
module.exports = { render };
