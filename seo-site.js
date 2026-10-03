(() => {
  const push = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...details });
  };

  const CABIN_IDS = { '1451962457697397900': 'Ocean Stay Sol', '1452755870408569390': 'Ocean Stay Zen', '1452772681885880930': 'Ocean Stay Rustic',
    '136074478': 'Ocean Stay Sol', '136074484': 'Ocean Stay Zen', '136074515': 'Ocean Stay Rustic' };
  const cabinName = link => link.dataset.cabinName ||
    (Object.keys(CABIN_IDS).find(id => link.href.includes(id)) ? CABIN_IDS[Object.keys(CABIN_IDS).find(id => link.href.includes(id))] : 'Unknown cabin');
  const placement = link => link.dataset.linkLocation ||
    link.closest('section, aside, header, footer')?.id || link.closest('section, aside, header, footer')?.tagName.toLowerCase() || 'page';

  document.querySelectorAll('a[href*="airbnb."]').forEach(link => {
    link.addEventListener('click', () => push('airbnb_click', {
      cabin_name: cabinName(link),
      destination_url: link.href,
      page_language: document.documentElement.lang,
      link_location: placement(link)
    }));
  });

  document.querySelectorAll('a[href*="ctrip.com"], a[href*="trip.com"]').forEach(link => {
    link.addEventListener('click', () => push('booking_click', {
      booking_platform: 'trip.com',
      cabin_name: link.dataset.cabinName || 'Unknown cabin',
      destination_url: link.href,
      page_language: document.documentElement.lang,
      link_location: link.dataset.linkLocation || 'page'
    }));
  });

  document.querySelectorAll('.languages a').forEach(link => {
    link.addEventListener('click', () => push('language_change', {
      selected_language: link.getAttribute('lang'),
      source_url: location.href,
      destination_url: link.href
    }));
  });

  document.querySelectorAll('a[href*="line.me"]').forEach(link => {
    link.addEventListener('click', () => push('contact_click', {
      contact_method: 'line',
      page_language: document.documentElement.lang,
      link_location: link.dataset.linkLocation || 'footer'
    }));
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => push('contact_click', {
      contact_method: 'email',
      page_language: document.documentElement.lang,
      link_location: 'footer'
    }));
  });

  document.querySelectorAll('.menu-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const header = button.closest('.topbar');
      const open = !header.classList.contains('menu-open');
      header.classList.toggle('menu-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? '×' : '☰';
    });
  });

  document.querySelectorAll('.rv-slider').forEach(box => {
    const track = box.querySelector('.rv-track');
    const step = dir => track.scrollBy({ left: dir * Math.max(track.clientWidth * 0.8, 280) });
    box.querySelector('.rv-prev').addEventListener('click', () => step(-1));
    box.querySelector('.rv-next').addEventListener('click', () => step(1));
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  });

  // Floating reserve menu (all pages that include it)
  const qrOpen = document.getElementById('quick-reserve-open');
  const qrMenu = document.getElementById('quick-reserve-menu');
  const qrClose = document.getElementById('quick-reserve-close');
  if (qrOpen && qrMenu && qrClose) {
    const setQr = open => {
      qrMenu.hidden = !open;
      qrOpen.setAttribute('aria-expanded', String(open));
      if (open) qrClose.focus(); else if (qrMenu.contains(document.activeElement) || document.activeElement === document.body) qrOpen.focus();
    };
    qrOpen.addEventListener('click', () => setQr(qrMenu.hidden));
    qrClose.addEventListener('click', () => setQr(false));
    qrMenu.addEventListener('click', e => { if (e.target.closest('a')) setQr(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !qrMenu.hidden) setQr(false); });
  }

  // Escape closes the mobile navigation
  document.addEventListener('keydown', e => {
    const header = document.querySelector('.topbar.menu-open');
    if (e.key === 'Escape' && header) {
      const b = header.querySelector('.menu-toggle');
      header.classList.remove('menu-open'); b.setAttribute('aria-expanded', 'false'); b.textContent = '☰'; b.focus();
    }
  });

  // Photo enlargement for cabin-page galleries
  const gal = [...document.querySelectorAll('.gallery-section img')];
  if (gal.length) {
    const lang = (document.documentElement.lang || 'en').slice(0, 2);
    const L = { en: ['Photo viewer', 'Close', 'Previous photo', 'Next photo'], ja: ['写真ビューア', '閉じる', '前の写真', '次の写真'], zh: ['照片查看器', '关闭', '上一张', '下一张'] }[lang] || ['Photo viewer', 'Close', 'Previous photo', 'Next photo'];
    const box = document.createElement('div');
    box.className = 'pv'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', L[0]);
    box.innerHTML = '<button type="button" class="pv-close" aria-label="' + L[1] + '">×</button><button type="button" class="pv-prev" aria-label="' + L[2] + '">←</button><figure><img alt="" /><figcaption></figcaption></figure><button type="button" class="pv-next" aria-label="' + L[3] + '">→</button>';
    document.body.appendChild(box);
    const big = box.querySelector('img'), cap = box.querySelector('figcaption');
    let idx = 0, trigger = null;
    const inertOthers = on => [...document.body.children].forEach(el => { if (el !== box) on ? el.setAttribute('inert', '') : el.removeAttribute('inert'); });
    const show = i => { idx = (i + gal.length) % gal.length; big.src = gal[idx].currentSrc || gal[idx].src; big.alt = gal[idx].alt; cap.textContent = gal[idx].alt; };
    const open = i => { trigger = document.activeElement; show(i); box.hidden = false; inertOthers(true); box.querySelector('.pv-close').focus(); };
    const close = () => { box.hidden = true; inertOthers(false); if (trigger) trigger.focus(); };
    gal.forEach((img, i) => {
      img.tabIndex = 0; img.setAttribute('role', 'button'); img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(i));
      img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });
    box.querySelector('.pv-close').addEventListener('click', close);
    box.querySelector('.pv-prev').addEventListener('click', () => show(idx - 1));
    box.querySelector('.pv-next').addEventListener('click', () => show(idx + 1));
    box.addEventListener('click', e => { if (e.target === box) close(); });
    box.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'Tab') {
        const f = [...box.querySelectorAll('button')], first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
})();
