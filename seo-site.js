(() => {
  const modalStates = new WeakMap();
  const photoRequests = new WeakMap();
  const setPhoto = (img, src, alt) => {
    const request = {};
    photoRequests.set(img, request);
    const figure = img.closest('figure');
    const dialog = img.closest('[role="dialog"]');
    figure?.classList.add('photo-is-loading');
    dialog?.setAttribute('aria-busy', 'true');
    img.alt = alt;
    img.src = src;
    const finish = failed => {
      if (photoRequests.get(img) !== request) return;
      figure?.classList.remove('photo-is-loading');
      dialog?.setAttribute('aria-busy', 'false');
      if (failed) {
        const message = { en: 'Photo could not load. Try the next photo.', ja: '写真を読み込めませんでした。次の写真をお試しください。', zh: '照片无法加载，请尝试下一张。' }[document.documentElement.lang.slice(0, 2)] || 'Photo could not load. Try the next photo.';
        const caption = figure?.querySelector('figcaption');
        if (caption) caption.textContent = message;
      }
    };
    img.decode().then(() => finish(false), () => finish(true));
  };
  const modalFocus = dialog => [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')]
    .filter(el => !el.disabled && el.getClientRects().length);
  const openModal = (dialog, trigger) => {
    if (modalStates.has(dialog)) return;
    const background = [...document.body.children].filter(el => el !== dialog && !['SCRIPT', 'NOSCRIPT'].includes(el.tagName));
    modalStates.set(dialog, { trigger, overflow: document.body.style.overflow,
      background: background.map(el => [el, el.hasAttribute('inert')]) });
    background.forEach(el => el.setAttribute('inert', ''));
    document.body.style.overflow = 'hidden';
    dialog.hidden = false;
    modalFocus(dialog)[0]?.focus();
  };
  const closeModal = dialog => {
    const state = modalStates.get(dialog);
    dialog.hidden = true;
    if (!state) return;
    state.background.forEach(([el, wasInert]) => { if (!wasInert) el.removeAttribute('inert'); });
    document.body.style.overflow = state.overflow;
    modalStates.delete(dialog);
    state.trigger?.focus();
  };
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const dialog = e.target instanceof Element ? e.target.closest('[role="dialog"][aria-modal="true"]') : null;
    if (!dialog || !modalStates.has(dialog)) return;
    const controls = modalFocus(dialog), first = controls[0], last = controls.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  });
  window.KojohamaUI = { openModal, closeModal, setPhoto };
  const directoryQuery = document.getElementById('directory-query');
  if (directoryQuery) {
    const directory = document.getElementById('around-the-cabins');
    const groups = [...directory.querySelectorAll('.directory-category')];
    const initialOpen = groups.map(group => group.open);
    const cards = [...directory.querySelectorAll('[data-venue]')];
    const status = document.getElementById('directory-count');
    const normalize = text => text.normalize('NFKC').toLocaleLowerCase();
    directory.querySelector('.directory-search').hidden = false;
    const filter = () => {
      const terms = normalize(directoryQuery.value).trim().split(/\s+/).filter(Boolean);
      let count = 0;
      cards.forEach(card => {
        card.hidden = !terms.every(term => normalize(card.dataset.search).includes(term));
        if (!card.hidden) count++;
      });
      groups.forEach((group, i) => {
        const visibleCount = [...group.querySelectorAll('[data-venue]')].filter(card => !card.hidden).length;
        group.hidden = visibleCount === 0;
        group.querySelector('.directory-group-count').textContent = `(${visibleCount})`;
        group.open = terms.length ? !group.hidden : initialOpen[i];
      });
      status.textContent = `${count} ${status.dataset.countLabel}`;
      document.getElementById('directory-empty').hidden = count !== 0;
    };
    directoryQuery.addEventListener('input', filter);
    document.getElementById('directory-clear').addEventListener('click', () => {
      directoryQuery.value = ''; filter(); directoryQuery.focus();
    });
    directory.querySelectorAll('.directory-nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (directoryQuery.value) { directoryQuery.value = ''; filter(); }
        const group = document.getElementById(link.hash.slice(1));
        if (group) group.open = true;
      });
    });
  }
  const push = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...details });
  };

  const CABIN_IDS = { '1451962457697397900': 'Ocean Stay Sol', '1452755870408569390': 'Ocean Stay Zen', '1452772681885880930': 'Ocean Stay Rustic',
    '136074478': 'Ocean Stay Sol', '136074484': 'Ocean Stay Zen', '136074515': 'Ocean Stay Rustic' };
  const cabinName = link => link.dataset.cabinName ||
    (Object.keys(CABIN_IDS).find(id => link.href.includes(id)) ? CABIN_IDS[Object.keys(CABIN_IDS).find(id => link.href.includes(id))] : 'Unknown cabin');
  const placement = link => link.dataset.linkLocation ||
    link.closest('section, aside, header, footer')?.id || link.closest('section, aside, header, footer')?.tagName.toLowerCase() || 'page';

  document.querySelectorAll('a[href*="airbnb."]').forEach(link => {
    const isReview = link.dataset.linkLocation === 'reviews' || link.dataset.intent === 'reviews';
    link.addEventListener('click', () => push(isReview ? 'review_click' : 'airbnb_click', {
      intent: isReview ? 'reviews' : 'booking',
      booking_platform: 'airbnb',
      cabin_name: cabinName(link),
      destination_url: link.href,
      page_language: document.documentElement.lang,
      link_location: placement(link)
    }));
  });

  document.querySelectorAll('a[href*="ctrip.com"], a[href*="trip.com"]').forEach(link => {
    link.addEventListener('click', () => push('booking_click', {
      booking_platform: link.href.includes('ctrip.com') ? 'ctrip' : 'trip.com',
      intent: 'booking',
      cabin_name: cabinName(link),
      destination_url: link.href,
      page_language: document.documentElement.lang,
      link_location: placement(link)
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
      link_location: placement(link)
    }));
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => push('contact_click', {
      contact_method: 'email',
      page_language: document.documentElement.lang,
      link_location: placement(link)
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
    const show = i => { idx = (i + gal.length) % gal.length; setPhoto(big, gal[idx].currentSrc || gal[idx].src, gal[idx].alt); cap.textContent = gal[idx].alt; };
    const open = i => { trigger = document.activeElement; show(i); openModal(box, trigger); };
    const close = () => closeModal(box);
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
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    });
  }
})();
