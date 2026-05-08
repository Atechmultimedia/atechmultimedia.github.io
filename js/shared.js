/* ============================================================
   shared.js — Atech Multimedia Entertainment
   Loaded by every page. Handles:
     - Sticky navigation
     - Back-to-top button
     - Quote modal (open / close / submit via Formspree)
     - Image right-click protection
     - Cookie consent banner
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     STICKY NAV
  ---------------------------------------------------------- */
  const navbar = document.querySelector('nav.main-nav');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('sticky-nav', window.pageYOffset > 80);
    });
  }

  /* ----------------------------------------------------------
     BACK TO TOP BUTTON
  ---------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.style.display = window.pageYOffset > 500 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     QUOTE MODAL
  ---------------------------------------------------------- */
  const quoteModal  = document.getElementById('quoteModal');
  const quoteBtn    = document.getElementById('quoteBtn');
  const quoteClose  = document.querySelector('#quoteModal .close');

  if (quoteBtn && quoteModal) {
    quoteBtn.addEventListener('click', function () {
      quoteModal.style.display = 'block';
    });
  }
  if (quoteClose && quoteModal) {
    quoteClose.addEventListener('click', function () {
      quoteModal.style.display = 'none';
    });
  }
  window.addEventListener('click', function (e) {
    if (quoteModal && e.target === quoteModal) {
      quoteModal.style.display = 'none';
    }
  });

  /* ----------------------------------------------------------
     QUOTE FORM — Formspree submission
  ---------------------------------------------------------- */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const original  = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.textContent = 'Sending…'; submitBtn.disabled = true; }

      fetch(quoteForm.action, {
        method:  quoteForm.method,
        body:    new FormData(quoteForm),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (r.ok) {
            alert('Thank you! Your quote request has been sent. We\'ll be in touch shortly.');
            quoteForm.reset();
            if (quoteModal) quoteModal.style.display = 'none';
          } else {
            alert('Oops! There was a problem submitting your form. Please try WhatsApp.');
          }
        })
        .catch(function () {
          alert('Connection error. Please reach us on WhatsApp: +233 24 326 6013');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.textContent = original; submitBtn.disabled = false; }
        });
    });
  }

  /* ----------------------------------------------------------
     IMAGE PROTECTION — disable right-click and drag
  ---------------------------------------------------------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    img.addEventListener('dragstart',   function (e) { e.preventDefault(); });
    img.setAttribute('draggable', 'false');
  });

  /* ----------------------------------------------------------
     COOKIE CONSENT BANNER
     Shows once; dismissed for 365 days via localStorage.
  ---------------------------------------------------------- */
  if (!localStorage.getItem('atech_cookies_accepted')) {
    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.innerHTML =
      '<p>We use cookies to improve your experience and analyse site traffic. ' +
      'By continuing you accept our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-btns">' +
        '<button id="cookieAccept" class="button">Accept</button>' +
        '<button id="cookieDecline">Decline</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookieAccept').addEventListener('click', function () {
      localStorage.setItem('atech_cookies_accepted', '1');
      banner.remove();
    });
    document.getElementById('cookieDecline').addEventListener('click', function () {
      banner.remove();
    });
  }

});
