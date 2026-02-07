/**
 * ═══════════════════════════════════════════════════════════════
 *  CONTACT PAGE — JS (Matching Index Architecture)
 *  FAQ is handled by script.js — no duplicate listeners here
 * ═══════════════════════════════════════════════════════════════
 */

class ContactPage {
  init() {
    this.initHeaderState();
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
