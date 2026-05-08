/* ============================================================
   contact.js — Atech Multimedia Entertainment
   Loaded by contact.html only. Handles:
     - Contact form submission via Formspree
     - FAQ accordion (open/close)
============================================================ */

/* ----------------------------------------------------------
   CONTACT FORM
---------------------------------------------------------- */
function initContactForm() {
  var contactForm = document.getElementById('contactForm');
  var successMsg  = document.getElementById('formSuccess');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = contactForm.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;
    }

    fetch(contactForm.action, {
      method:  'POST',
      body:    new FormData(contactForm),
      headers: { Accept: 'application/json' }
    })
      .then(function (r) {
        if (r.ok) {
          contactForm.reset();
          if (successMsg) successMsg.style.display = 'block';
          if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-check" style="margin-right:8px;"></i>Message Sent!';
            submitBtn.style.background = '#25D366';
          }
        } else {
          alert('Oops! There was a problem. Please try WhatsApp instead.');
          if (submitBtn) { submitBtn.textContent = 'Send Message'; submitBtn.disabled = false; }
        }
      })
      .catch(function () {
        alert('Connection error. Please reach us on WhatsApp: +233 24 326 6013');
        if (submitBtn) { submitBtn.textContent = 'Send Message'; submitBtn.disabled = false; }
      });
  });
}

/* ----------------------------------------------------------
   FAQ ACCORDION
   Clicking a question opens its answer and closes all others.
---------------------------------------------------------- */
function toggleFaq(el) {
  var answer = el.nextElementSibling;
  var isOpen = el.classList.contains('open');

  // Close every open item
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.classList.remove('open');
    if (q.nextElementSibling) q.nextElementSibling.style.display = 'none';
  });

  // If it was closed, open it now
  if (!isOpen) {
    el.classList.add('open');
    if (answer) answer.style.display = 'block';
  }
}

/* ----------------------------------------------------------
   BACK TO TOP (contact page is long)
   shared.js already handles this if #backToTop exists,
   but we ensure the button is visible on this page too.
---------------------------------------------------------- */
function ensureBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) {
    var newBtn = document.createElement('button');
    newBtn.id        = 'backToTop';
    newBtn.title     = 'Back to top';
    newBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    newBtn.style.display = 'none';
    document.body.appendChild(newBtn);
    window.addEventListener('scroll', function () {
      newBtn.style.display = window.pageYOffset > 500 ? 'block' : 'none';
    });
    newBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ----------------------------------------------------------
   BOOT
---------------------------------------------------------- */
/* ----------------------------------------------------------
   FAQ — event delegation (replaces inline onclick="toggleFaq")
   Wires all .faq-question clicks inside .faq-list.
---------------------------------------------------------- */
function initFaqAccordion() {
  var faqList = document.querySelector('.faq-list');
  if (!faqList) return;
  faqList.addEventListener('click', function (e) {
    var question = e.target.closest('.faq-question');
    if (!question) return;
    toggleFaq(question);
  });
}

/* ----------------------------------------------------------
   BOOT
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initContactForm();
  initFaqAccordion();
  ensureBackToTop();
});
