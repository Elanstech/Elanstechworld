/* Elan's Tech World — site behaviour. Works without GSAP/Lenis; they only add the scroll effects. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header & mobile menu ── */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('.menu-btn');
  const mobileNav = $('#mobileNav');
  const setMenu = open => {
    if (!menuBtn) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    window.__lenis?.[open ? 'stop' : 'start']();
  };
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  mobileNav?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ── Smooth scroll + scroll-linked effects (only if the libraries loaded) ── */
  function initMotion() {
    const { gsap, ScrollTrigger, Lenis } = window;
    if (!gsap || !ScrollTrigger || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    if (Lenis) {
      const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const el = id === '#top' ? document.body : $(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: id === '#top' ? 0 : -90 });
      }));
    }

    const mm = gsap.matchMedia();

    // Live-build window: tilted back in 3D, flattens as it scrolls into view.
    const lb = $('#liveBuild');
    if (lb) {
      mm.add({ wide: '(min-width: 861px)', narrow: '(max-width: 860px)' }, ctx => {
        const tilt = ctx.conditions.wide ? 16 : 7;
        gsap.fromTo(lb, { rotateX: tilt, scale: ctx.conditions.wide ? 0.92 : 0.97, y: 0 }, {
          rotateX: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.lb-stage', start: 'top 92%', end: 'top 18%', scrub: 0.7 },
        });
      });
    }

    // Recent work: vertical scroll drives a horizontal reel on wide screens.
    const hs = $('#workScroll');
    if (hs) {
      mm.add('(min-width: 900px)', () => {
        const track = $('.hs__track', hs);
        hs.classList.add('is-pinned');
        const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        const tween = gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: hs, start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        // gentle parallax on each screenshot while the reel moves
        $$('.hs__media img', hs).forEach(img => {
          gsap.fromTo(img, { scale: 1.08, xPercent: 3 }, { scale: 1.08, xPercent: -3, ease: 'none', scrollTrigger: { trigger: img.closest('.hs__panel'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        return () => hs.classList.remove('is-pinned');
      });
    }

    // Case study + portfolio: device frames drift a little against the scroll.
    $$('.phone--stage, .cs-phones__row .phone:nth-child(2)').forEach(el => {
      gsap.fromTo(el, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    addEventListener('load', () => ScrollTrigger.refresh());
  }
  if (document.readyState === 'complete') initMotion(); else addEventListener('load', initMotion, { once: true });

  /* ── Live build: types each client's real brand tokens, then reveals their site ── */
  const lbRoot = $('#liveBuild');
  const lbData = $('#lbData');
  if (lbRoot && lbData) {
    const sites = JSON.parse(lbData.textContent);
    const code = $('#lbCode');
    const pre = code.parentElement;
    const urlEl = $('#lbUrl');
    const link = $('#lbLink');
    const tabs = $$('.lb__tab', lbRoot);
    const status = $('.lb__status-t', lbRoot);
    let imgOn = $('#lbImgA');
    let imgIn = $('#lbImgB');
    const scan = $('.lb__scan', lbRoot);
    let idx = 0, run = 0, visible = true, paused = false, holdTimer = 0;

    const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));
    const program = s => {
      const w = Math.max(...s.palette.map(p => p.v.length), 9) + 2;
      const ops = [
        ['c', `/* ${s.domain} */`], ['nl'],
        ['c', `/* ${s.where} */`], ['nl'], ['nl'],
        ['s', ':root'], ['p', ' {'], ['nl'],
      ];
      s.palette.forEach(p => { ops.push(['p', '  '], ['v', pad(p.v + ':', w)], ['sw', p.hex], ['n', p.hex], ['p', ';'], ['nl']); });
      ops.push(['p', '  '], ['v', pad('--display:', w)], ['k', `"${s.display}"`], ['p', ';'], ['nl']);
      if (s.body !== s.display) ops.push(['p', '  '], ['v', pad('--text:', w)], ['k', `"${s.body}"`], ['p', ';'], ['nl']);
      if (s.accent) ops.push(['p', '  '], ['v', pad('--accent:', w)], ['k', `"${s.accent}"`], ['p', ';'], ['nl']);
      ops.push(['p', '}'], ['nl'], ['nl']);
      ops.push(['s', 'h1'], ['p', ' {'], ['nl'], ['p', '  font-family: '], ['v', 'var(--display)'], ['p', ';'], ['nl']);
      ops.push(['p', '  color: '], ['v', `var(${s.palette[1]?.v || s.palette[0].v})`], ['p', ';'], ['nl'], ['p', '}']);
      return ops;
    };

    const caret = document.createElement('span');
    caret.className = 'caret';

    function renderInstant(ops) {
      code.textContent = '';
      for (const [cls, text] of ops) {
        if (cls === 'nl') code.append('\n');
        else if (cls === 'sw') { const sw = document.createElement('span'); sw.className = 'sw'; sw.style.background = text; code.append(sw); }
        else { const sp = document.createElement('span'); sp.className = cls; sp.textContent = text; code.append(sp); }
      }
      code.append(caret);
    }

    function typeUrl(domain, myRun) {
      urlEl.textContent = '';
      let i = 0;
      const step = () => {
        if (myRun !== run) return;
        urlEl.textContent = domain.slice(0, ++i);
        if (i < domain.length) setTimeout(step, 22);
      };
      step();
    }

    function reveal(s, myRun, first) {
      if (myRun !== run) return;
      lbRoot.classList.add('is-done');
      status.textContent = 'live';
      lbRoot.classList.remove('is-building');
      link.href = `/portfolio/${s.slug}/`;
      link.setAttribute('aria-label', `${s.name} case study`);
      const done = () => {
        if (myRun !== run) return;
        imgOn.classList.remove('is-on');
        imgIn.classList.remove('is-in');
        imgIn.classList.add('is-on');
        [imgOn, imgIn] = [imgIn, imgOn];
        scheduleNext(myRun);
      };
      if (first) { scan.classList.remove('is-run'); void scan.offsetWidth; scan.classList.add('is-run'); scheduleNext(myRun); return; }
      imgIn.alt = `${s.name} website`;
      const go = () => {
        if (myRun !== run) return;
        if (reduced) return done();
        imgIn.classList.add('is-in');
        scan.classList.remove('is-run'); void scan.offsetWidth; scan.classList.add('is-run');
        setTimeout(done, 1080);
      };
      imgIn.srcset = `${s.img} 1440w, ${s.img2x} 2880w`;
      imgIn.src = s.img;
      if (imgIn.complete && imgIn.naturalWidth > 1) go(); else imgIn.onload = go;
    }

    function scheduleNext(myRun) {
      clearTimeout(holdTimer);
      if (reduced) return;
      const hold = 3600;
      const tab = tabs[idx];
      tab.style.setProperty('--p', 0);
      const t0 = performance.now();
      const bar = () => { if (myRun !== run) return; const k = Math.min(1, (performance.now() - t0) / hold); tab.style.setProperty('--p', k.toFixed(3)); if (k < 1) requestAnimationFrame(bar); };
      requestAnimationFrame(bar);
      holdTimer = setTimeout(() => { if (myRun === run) waitThen(() => play((idx + 1) % sites.length)); }, hold);
    }

    function waitThen(fn) {
      if (visible && !paused && !document.hidden) return fn();
      const iv = setInterval(() => { if (visible && !paused && !document.hidden) { clearInterval(iv); fn(); } }, 300);
    }

    function play(i, first = false) {
      const myRun = ++run;
      idx = i;
      const s = sites[i];
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.style.setProperty('--p', 0); });
      tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      lbRoot.classList.remove('is-done');
      if (!first) lbRoot.classList.add('is-building');
      status.textContent = 'writing';
      // warm the next screenshot while we type
      const nx = sites[(i + 1) % sites.length]; const warm = new Image(); warm.src = nx.img;
      const ops = program(s);
      if (reduced) { renderInstant(ops); urlEl.textContent = s.domain; return reveal(s, myRun, first); }
      typeUrl(s.domain, myRun);
      code.textContent = '';
      code.append(caret);
      let o = 0, c = 0, cur = null;
      const tick = () => {
        if (myRun !== run) return;
        if (!visible || document.hidden) return requestAnimationFrame(tick);
        let budget = 3 + Math.round(Math.random() * 3);
        while (budget > 0 && o < ops.length) {
          const [cls, text] = ops[o];
          if (cls === 'nl') { caret.before('\n'); o++; cur = null; budget -= 2; continue; }
          if (cls === 'sw') { const sw = document.createElement('span'); sw.className = 'sw'; sw.style.background = text; caret.before(sw); o++; continue; }
          if (!cur) { cur = document.createElement('span'); cur.className = cls; caret.before(cur); c = 0; }
          const n = Math.min(budget, text.length - c);
          cur.textContent += text.slice(c, c + n);
          c += n; budget -= n;
          if (c >= text.length) { o++; cur = null; }
        }
        pre.scrollTop = pre.scrollHeight;
        if (o < ops.length) requestAnimationFrame(tick);
        else setTimeout(() => reveal(s, myRun, first), 260);
      };
      requestAnimationFrame(tick);
    }

    tabs.forEach((t, k) => t.addEventListener('click', () => { clearTimeout(holdTimer); play(k); }));
    lbRoot.addEventListener('pointerenter', () => { paused = true; });
    lbRoot.addEventListener('pointerleave', () => { paused = false; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.15 }).observe(lbRoot);

    // start once the intro animation has settled
    setTimeout(() => play(0, true), reduced ? 0 : 900);
  }

  /* ── Browse the live site ── */
  $$('.browse__frame').forEach(frame => {
    const vp = $('.browse__viewport', frame);
    const start = $('.browse__start', frame);
    const url = frame.dataset.browse;
    const load = () => {
      const loading = document.createElement('div');
      loading.className = 'browse__loading';
      loading.textContent = `Loading ${new URL(url).host.replace(/^www\./, '')}…`;
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.title = `Live preview of ${new URL(url).host}`;
      iframe.setAttribute('loading', 'eager');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.addEventListener('load', () => loading.classList.add('is-gone'));
      setTimeout(() => { if (!loading.classList.contains('is-gone')) loading.innerHTML = `Still loading… <a href="${url}" target="_blank" rel="noopener">open it in a new tab</a>`; }, 9000);
      start.replaceWith(iframe);
      vp.append(loading);
      iframe.focus({ preventScroll: true });
    };
    start?.addEventListener('click', load, { once: true });
    $$('.browse__modes button', frame).forEach(b => b.addEventListener('click', () => {
      frame.dataset.mode = b.dataset.mode;
      $$('.browse__modes button', frame).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      setTimeout(() => window.ScrollTrigger?.refresh(), 750);
    }));
  });

  /* ── Contact form (FormSubmit) ── */
  const form = $('#contactForm');
  if (form) {
    const statusEl = $('.form__status', form);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      statusEl.className = 'form__status';
      const required = $$('[required]', form);
      let bad = null;
      required.forEach(f => { const ok = f.value.trim() && f.checkValidity(); f.classList.toggle('is-invalid', !ok); if (!ok && !bad) bad = f; });
      if (bad) { statusEl.textContent = bad.type === 'email' ? 'Please enter a valid email address.' : 'Please fill in your name, email and a short message.'; statusEl.classList.add('is-err'); bad.focus(); return; }
      const fd = new FormData(form);
      if (fd.get('_honey')) return;
      const payload = {
        name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), business: fd.get('business'),
        website: fd.get('website'), budget: fd.get('budget'), needs: fd.getAll('needs').join(', '), message: fd.get('message'),
        _subject: `New project inquiry — ${fd.get('name')}${fd.get('business') ? ` (${fd.get('business')})` : ''}`,
        _template: 'table', _captcha: 'false', _replyto: fd.get('email'),
      };
      const btn = $('button[type="submit"]', form);
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const r = await fetch('https://formsubmit.co/ajax/elan@elanstechworld.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) === 'false') throw new Error(j.message || 'send failed');
        const first = String(payload.name).trim().split(/\s+/)[0];
        statusEl.textContent = `Thanks, ${first} — your message is in. Elan will reply personally, usually the same day.`;
        statusEl.classList.add('is-ok');
        form.classList.add('is-sent');
      } catch {
        statusEl.innerHTML = 'Your message didn\'t send. Please call or text <a href="tel:+19294176819">(929) 417-6819</a> or email <a href="mailto:elan@elanstechworld.com">elan@elanstechworld.com</a>.';
        statusEl.classList.add('is-err');
        btn.disabled = false; btn.textContent = 'Send message';
      }
    });
  }
})();
