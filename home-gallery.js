(() => {
const galleryData = JSON.parse(document.getElementById("gallery-data").textContent);
const galleryCaptions = JSON.parse(document.getElementById("gallery-captions").textContent);
const lightbox = document.getElementById('photo-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxTitle = document.getElementById('lightbox-title');
let activeGallery = null;
let activeIndex = 0;
let lastGalleryTrigger = null;
function showGalleryPhoto() {
  const gallery = galleryData[activeGallery];
  const photoUrl = gallery.images[activeIndex];
  window.KojohamaUI.setPhoto(lightboxImage, photoUrl, galleryCaptions[photoUrl] || `${gallery.alt} ${activeIndex + 1}`);
  lightboxCaption.textContent = `${activeIndex + 1} / ${gallery.images.length} · ${lightboxImage.alt}`;
  lightboxTitle.textContent = gallery.title;
}
function openGallery(name, trigger) {
  lastGalleryTrigger = trigger || null;
  activeGallery = name; activeIndex = 0; showGalleryPhoto(); window.KojohamaUI.openModal(lightbox, lastGalleryTrigger); document.body.classList.add('lightbox-open');
}
function closeGallery() { window.KojohamaUI.closeModal(lightbox); document.body.classList.remove('lightbox-open'); }
document.querySelectorAll('[data-gallery-open]').forEach(button => button.addEventListener('click', () => openGallery(button.dataset.galleryOpen, button)));
document.getElementById('lightbox-close').addEventListener('click', closeGallery);
function changeGallery(delta) {
  if (!activeGallery || !galleryData[activeGallery]) return;
  const gallery = galleryData[activeGallery];
  activeIndex = (activeIndex + delta + gallery.images.length) % gallery.images.length;
  showGalleryPhoto();
}
document.getElementById('lightbox-prev').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); changeGallery(-1); });
document.getElementById('lightbox-next').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); changeGallery(1); });
let touchStartX = 0;
let touchStartY = 0;
lightbox.addEventListener('touchstart', event => {
  if (event.touches.length !== 1) return;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });
lightbox.addEventListener('touchend', event => {
  if (!touchStartX || !event.changedTouches.length) return;
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;
  touchStartX = 0;
  touchStartY = 0;
  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
  changeGallery(deltaX < 0 ? 1 : -1);
}, { passive: true });
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeGallery(); });
document.addEventListener('keydown', event => { if (!lightbox.hidden) { if (event.key === 'Escape') closeGallery(); if (event.key === 'ArrowLeft') { event.preventDefault(); changeGallery(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); changeGallery(1); } } });
const siteHeader = document.querySelector('.topbar');
function scrollToSection(id) {
  const target = id === 'top' ? document.body : document.getElementById(id);
  if (!target) return;
  const headerHeight = siteHeader ? siteHeader.getBoundingClientRect().height : 0;
  const targetTop = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  if (id === 'main-content') { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  if (history.pushState) history.pushState(null, '', id === 'top' ? location.pathname + location.search : '#' + id);
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (link.getAttribute('href') === '#') return;
  link.addEventListener('click', event => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    event.preventDefault();
    scrollToSection(id);
  });
});


})();
