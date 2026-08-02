/* ═══════════════════════════════════════════════════════════════════════════
   ELAN'S TECH WORLD — CONTACT PAGE (ES6)
   ─────────────────────────────────────────────────────────────────────────
   Loads after js/script.js and reuses its globals (Env, q, qa, gsap).

   Modules:
     OpenNow    — live "we're open / we'll reply in the morning" indicator
     Ticket     — serial number for the work order
     Estimator  — running ballpark price and timeline as choices are made
     Enquiry    — validation, submission, and the received state
   ═══════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* Where the form posts. FormSubmit needs one real submission from this
     address to activate — the first send returns an activation link by email;
     click it once and every send after that lands silently in the inbox. */
  const ENDPOINT = 'https://formsubmit.co/ajax/elan@elanstechworld.com';

  const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;

  /* ═══════════════════════════════════════════════════════════════════
     OPEN NOW — honest about when a reply is realistic
     ═══════════════════════════════════════════════════════════════════ */

  class OpenNow {
    constructor() {
      this.el = q('#ctStatus');
      this.wrap = q('.ct-status');
      if (!this.el) return;

      this.update();
      setInterval(() => this.update(), 60000);
    }

    update() {
      /* always reason in New York time, whatever timezone the visitor is in */
      let hour = new Date().getHours();
      let day = new Date().getDay();

      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          hour: 'numeric',
          hour12: false,
          weekday: 'short',
        }).formatToParts(new Date());

        const h = parts.find((p) => p.type === 'hour');
        const w = parts.find((p) => p.type === 'weekday');
        if (h) hour = Number(h.value);
        if (w) day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(w.value);
      } catch {
        /* Intl unavailable — the local clock is a reasonable fallback */
      }

      const weekday = day >= 1 && day <= 5;
      const open = weekday ? hour >= 9 && hour < 18 : hour >= 10 && hour < 16;

      this.wrap?.classList.toggle('is-closed', !open);
      this.el.textContent = open
        ? 'Open now — usually replies within the hour'
        : hour >= 18 || hour < 9
          ? 'After hours — text anyway, Elan reads them tonight'
          : 'Weekend hours — replies within a few hours';
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     TICKET NUMBER
     ═══════════════════════════════════════════════════════════════════ */

  class Ticket {
    constructor() {
      const now = new Date();
      const stamp =
        String(now.getFullYear()).slice(2) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
      const rand = String(Math.floor(Math.random() * 900) + 100);

      this.value = `${stamp}-${rand}`;

      const el = q('#ctTicketNo');
      if (el) el.textContent = this.value;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     ESTIMATOR
     Answers the question everyone has before they call. Deliberately a
     range, clearly labelled a ballpark — an honest wide number builds more
     trust than a precise number that turns out to be wrong.
     ═══════════════════════════════════════════════════════════════════ */

  class Estimator {
    constructor() {
      this.services = qa('#ctServices .ct-chip');
      this.timing = qa('#ctTiming .ct-chip');
      if (!this.services.length) return;

      this.figure = q('#ctFigure');
      this.time = q('#ctTime');
      this.list = q('#ctList');

      this.fServices = q('#ctServicesField');
      this.fTiming = q('#ctTimingField');
      this.fEstimate = q('#ctEstimateField');

      this.services.forEach((chip) => {
        chip.addEventListener('click', () => {
          /* "Not sure yet" is exclusive — it means the opposite of the others */
          if (chip.dataset.unsure) {
            const on = chip.classList.contains('is-on');
            this.services.forEach((c) => c.classList.remove('is-on'));
            chip.classList.toggle('is-on', !on);
          } else {
            q('#ctServices .ct-chip[data-unsure]')?.classList.remove('is-on');
            chip.classList.toggle('is-on');
          }
          this.update();
        });
      });

      this.timing.forEach((chip) => {
        chip.addEventListener('click', () => {
          this.timing.forEach((c) => c.classList.toggle('is-on', c === chip));
          this.update();
        });
      });

      this.update();
    }

    update() {
      const picked = this.services.filter((c) => c.classList.contains('is-on'));
      const timing = this.timing.find((c) => c.classList.contains('is-on'));

      if (this.fServices) this.fServices.value = picked.map((c) => c.dataset.service).join(', ');
      if (this.fTiming) this.fTiming.value = timing?.dataset.timing || '';

      if (!picked.length) {
        this.figure.textContent = 'Pick a service';
        this.figure.classList.add('is-quiet');
        this.time.textContent = '—';
        this.list.innerHTML = '<li class="ct-estimate-empty">Nothing selected yet.</li>';
        if (this.fEstimate) this.fEstimate.value = '';
        return;
      }

      let min = 0;
      let max = 0;
      let weeksMin = 0;
      let weeksMax = 0;
      let quoted = false;
      let monthly = false;
      let unsure = false;

      const rows = picked.map((chip) => {
        const d = chip.dataset;
        let note;

        if (d.unsure) {
          unsure = true;
          note = "let's talk";
        } else if (d.monthly) {
          monthly = true;
          note = 'monthly';
        } else if (d.quote) {
          quoted = true;
          note = 'quoted';
        } else {
          min += Number(d.min || 0);
          max += Number(d.max || 0);
          note = `${money(Number(d.min))}+`;
        }

        /* build phases overlap, so take the longest rather than the sum */
        weeksMin = Math.max(weeksMin, Number(d.wmin || 0));
        weeksMax = Math.max(weeksMax, Number(d.wmax || 0));

        return `<li><span>${d.service}</span><b>${note}</b></li>`;
      });

      this.list.innerHTML = rows.join('');

      /* headline figure */
      this.figure.classList.remove('is-quiet');

      if (unsure) {
        this.figure.textContent = "Let's scope it together";
        this.figure.classList.add('is-quiet');
      } else if (min > 0) {
        this.figure.textContent = `${money(min)} — ${money(max)}`;
      } else if (monthly && !quoted) {
        this.figure.textContent = 'Monthly, ROI-based';
        this.figure.classList.add('is-quiet');
      } else {
        this.figure.textContent = 'Quoted per scope';
        this.figure.classList.add('is-quiet');
      }

      /* timeline */
      if (unsure || (!weeksMin && !weeksMax)) {
        this.time.textContent = 'Timeline set on the call';
      } else {
        const rush = timing?.dataset.timing === 'As soon as possible';
        this.time.textContent = `${weeksMin}–${weeksMax} weeks${rush ? ' · rush slots available' : ''}`;
      }

      if (this.fEstimate) {
        this.fEstimate.value = `${this.figure.textContent} · ${this.time.textContent}`;
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     ENQUIRY — validate, send, confirm
     ═══════════════════════════════════════════════════════════════════ */

  class Enquiry {
    constructor(ticket) {
      this.form = q('#ctForm');
      if (!this.form) return;

      this.ticket = ticket;
      this.button = q('#ctSend');
      this.error = q('#ctError');
      this.sent = q('#ctSent');

      this.form.addEventListener('submit', (e) => this.submit(e));

      /* clear the invalid state as soon as they start fixing it */
      qa('input, textarea', this.form).forEach((input) => {
        input.addEventListener('input', () => input.closest('.ct-input')?.classList.remove('is-invalid'));
      });

      this.sent?.addEventListener('click', (e) => {
        if (e.target === this.sent) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    }

    valid() {
      let ok = true;

      const check = (input, test) => {
        const wrap = input.closest('.ct-input');
        const good = test(input.value.trim());
        wrap?.classList.toggle('is-invalid', !good);
        if (!good && ok) {
          input.focus();
          ok = false;
        }
      };

      check(q('#ctName'), (v) => v.length > 1);
      check(q('#ctEmail'), (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));

      return ok;
    }

    async submit(event) {
      event.preventDefault();
      this.hideError();

      if (!this.valid()) {
        this.showError('Please add your name and a valid email so we can reply.');
        return;
      }

      /* honeypot — a real person never fills this in */
      if (this.form.querySelector('[name="_honey"]').value) return;

      const label = q('.btn-text', this.button);
      const original = label.textContent;
      label.textContent = 'Sending…';
      this.button.classList.add('ct-send-loading');

      const data = new FormData(this.form);
      data.append('ticket', this.ticket.value);
      data.append('page', window.location.href);

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        this.open();
        this.form.reset();
        qa('.ct-chip.is-on', this.form).forEach((c) => c.classList.remove('is-on'));
      } catch {
        /* never leave someone stuck — give them the direct line instead */
        this.showError(
          'That didn\'t go through. Please call or text <a href="tel:+19294176819">(929) 417-6819</a> or email <a href="mailto:elan@elanstechworld.com">elan@elanstechworld.com</a> — we\'ll pick it up right away.',
        );
      } finally {
        label.textContent = original;
        this.button.classList.remove('ct-send-loading');
      }
    }

    showError(html) {
      if (!this.error) return;
      this.error.innerHTML = html;
      this.error.hidden = false;
    }

    hideError() {
      if (this.error) this.error.hidden = true;
    }

    open() {
      const no = q('#ctSentNo');
      if (no) no.textContent = this.ticket.value;

      this.sent?.classList.add('is-open');
      this.sent?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.sent?.classList.remove('is-open');
      this.sent?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════════════════ */

  const boot = () => {
    new OpenNow();
    const ticket = new Ticket();
    new Estimator();
    new Enquiry(ticket);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
