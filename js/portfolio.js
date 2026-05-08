/* ============================================================
   portfolio.js — Atech Multimedia Entertainment
   Loaded by portfolio.html only. Handles:
     - Gallery category filter
     - URL hash filter persistence (shareable links)
     - Lightbox viewer with keyboard navigation
     - Image placeholder swap on load error
============================================================ */

/* ----------------------------------------------------------
   PLACEHOLDER SWAP
   Called via onerror on each gallery img.
   Replaces broken image with a coloured category tile.
---------------------------------------------------------- */
/* swapPh — called directly OR triggered by image error listener */
function swapPh(img, cls, icon, title, cat) {
  var item = img.closest ? img.closest('.gallery-item') : null;
  if (!item) return;
  item.innerHTML =
    '<div class="ph-tile ' + cls + '">' +
      '<i class="' + icon + '"></i>' +
      '<h4>' + title + '</h4>' +
      '<small>' + cat + '</small>' +
    '</div>';
  item.style.cursor = 'default';
}

/* Wire image errors from data attributes — replaces inline onerror */
function initImageErrorHandlers() {
  document.querySelectorAll('.gallery-item img[data-ph-cls]').forEach(function (img) {
    img.addEventListener('error', function () {
      swapPh(
        this,
        this.getAttribute('data-ph-cls'),
        this.getAttribute('data-ph-icon'),
        this.getAttribute('data-ph-title'),
        this.getAttribute('data-ph-cat')
      );
    });
  });
}

/* Wire video fallback errors — replaces inline onerror on <video> */
var videoFallbacks = {
  youtube:  '<div class="video-thumb"><i class="fab fa-youtube" style="color:#FF0000"></i><span>Multimedia Reel</span></div>',
  tiktok:   '<div class="video-thumb"><i class="fab fa-tiktok"></i><span>Social Media Reels</span></div>',
  facebook: '<div class="video-thumb"><i class="fab fa-facebook-f" style="color:#1877F2"></i><span>Event Coverage</span></div>'
};

function initVideoErrorHandlers() {
  document.querySelectorAll('video[data-fallback]').forEach(function (video) {
    video.addEventListener('error', function () {
      var key = this.getAttribute('data-fallback');
      if (videoFallbacks[key]) {
        this.outerHTML = videoFallbacks[key];
      }
    });
  });
}

/* ----------------------------------------------------------
   GALLERY FILTER
   Reads/writes the URL hash so filtered views are shareable.
   e.g. portfolio.html#branding
---------------------------------------------------------- */
var filterBtns = [];
var allItems   = [];
var noResults  = null;

function applyFilter(filter) {
  filterBtns.forEach(function (b) {
    b.classList.toggle('active', b.dataset.filter === filter);
  });

  var visible = 0;
  allItems.forEach(function (item) {
    var match = filter === 'all' || item.dataset.category === filter;
    item.style.display = match ? 'block' : 'none';
    if (match) visible++;
  });

  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  // Update URL hash without scrolling
  history.replaceState(null, '', '#' + filter);
}

function initFilter() {
  filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
  allItems   = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  noResults  = document.getElementById('noResults');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(this.dataset.filter);
    });
  });

  // Restore filter from URL hash on page load
  var hash = window.location.hash.replace('#', '');
  var valid = ['all', 'branding', 'print', 'apparel', 'photo', 'events', 'publishing'];
  applyFilter(valid.indexOf(hash) > -1 ? hash : 'all');
}

/* ----------------------------------------------------------
   LIGHTBOX
---------------------------------------------------------- */
var lbItems   = [];
var lbCurrent = 0;

function buildLbItems() {
  lbItems = [];
  allItems.forEach(function (item) {
    if (item.style.display === 'none') return;
    var img = item.querySelector('img');
    if (img && img.complete && img.naturalWidth > 0) {
      lbItems.push({
        src:   img.src,
        title: item.dataset.title || '',
        desc:  item.dataset.desc  || ''
      });
    }
  });
}

function openLightbox(idx) {
  if (!lbItems.length) return;
  lbCurrent = ((idx % lbItems.length) + lbItems.length) % lbItems.length;
  var it = lbItems[lbCurrent];
  document.getElementById('lbImg').src             = it.src;
  document.getElementById('lbTitle').textContent   = it.title;
  document.getElementById('lbDesc').textContent    = it.desc;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxBtn() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  openLightbox(lbCurrent + dir);
}

function initLightbox() {
  allItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      if (!img || !img.complete || img.naturalWidth === 0) return;
      buildLbItems();
      var clicked = lbItems.findIndex(function (i) { return i.src === img.src; });
      openLightbox(clicked > -1 ? clicked : 0);
    });
  });

  // Backdrop click to close
  var lb = document.getElementById('lightbox');
  if (lb) lb.addEventListener('click', closeLightbox);

  // Named button wiring (replaces inline onclick)
  var lbPrev  = document.getElementById('lbPrev');
  var lbNext  = document.getElementById('lbNext');
  var lbClose = document.getElementById('lbClose');
  if (lbPrev)  lbPrev.addEventListener('click',  function (e) { e.stopPropagation(); lbNav(-1); });
  if (lbNext)  lbNext.addEventListener('click',  function (e) { e.stopPropagation(); lbNav(1); });
  if (lbClose) lbClose.addEventListener('click', function (e) { e.stopPropagation(); closeLightboxBtn(); });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    var box = document.getElementById('lightbox');
    if (!box || !box.classList.contains('open')) return;
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'ArrowLeft')  lbNav(-1);
    if (e.key === 'Escape')     closeLightboxBtn();
  });
}

/* ----------------------------------------------------------
   BOOT
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initImageErrorHandlers();
  initVideoErrorHandlers();
  initFilter();
  initLightbox();
});
