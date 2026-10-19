const { copy } = require('../data/guest-charges.json');
// Cabin pages show the policy folded (still in the page and searchable); FAQ and comparison pages keep it open.
function render(lang, { collapsed = false } = {}) {
 const t = copy[lang];
 const body = `<ul>${t.items.map(x=>`<li>${x}</li>`).join('')}</ul><p class="note">${t.note}</p>`;
 if (collapsed) return `<section class="wrap section-block" id="guest-charges"><details class="collapsible"><summary><h2>${t.title}</h2></summary>${body}</details></section>`;
 return `<section class="wrap section-block" id="guest-charges"><h2>${t.title}</h2>${body}</section>`;
}
module.exports = { render };
