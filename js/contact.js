/**
 * ═══════════════════════════════════════════════════════════════
 *  CONTACT PAGE — JS (Matching Index Architecture)
 *  Handles: FAQ accordion, smooth scroll, header state
 * ═══════════════════════════════════════════════════════════════
 */

class ContactPage {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');
  }

  init() {
    this.initFAQ();
    this.initHeaderState();
  }

  /* ── FAQ Accordion ── */
  initFAQ() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');

        // Close all
        this.faqItems.forEach(i => i.classList.remove('active'));

        // Toggle current
        if (!wasActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        } else {
          question.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ── Header: Always scrolled state on contact page ── */
  initHeaderState() {
    const header = document.getElementById('header');
    if (header) {
      header.classList.add('scrolled');
    }
  }
}

/* ── Init ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ContactPage().init());
} else {
  new ContactPage().init();
}
