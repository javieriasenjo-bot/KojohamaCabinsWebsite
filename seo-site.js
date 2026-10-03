(() => {
  const push = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...details });
  };

  document.querySelectorAll('a[href*="airbnb."]').forEach(link => {
    link.addEventListener('click', () => push('airbnb_click', {
      cabin_name: link.dataset.cabinName || 'Unknown cabin',
      destination_url: link.href,
      page_language: document.documentElement.lang,
      link_location: link.dataset.linkLocation || 'page'
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
})();
