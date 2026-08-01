/* ═══════════════════════════════════════════════════════════════
   ELAN'S TECH WORLD — motion & interaction
   ═══════════════════════════════════════════════════════════════ */
(function(){
"use strict";

const doc = document.documentElement;
const RM  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

if (RM || !hasGSAP) doc.classList.add("no-motion");

const $  = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

/* ── kill loader instantly if we can't animate ── */
const loader = $("#loader");
if ((RM || !hasGSAP) && loader) loader.style.display = "none";

if (!hasGSAP) return;                 // graceful static page
gsap.registerPlugin(ScrollTrigger);

/* ── smooth scroll (Lenis, optional) ───────────── */
let lenis = null;
if (!RM && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
}
function scrollToTarget(el){
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
}
$$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const t = $(id);
        if (!t) return;
        e.preventDefault();
        scrollToTarget(t);
    });
});

/* ── split hero word into chars ────────────────── */
const heroWord = $("#heroWord");
let heroChars = [];
if (heroWord) {
    const txt = heroWord.textContent.trim();
    heroWord.textContent = "";
    txt.split("").forEach((ch, i) => {
        const s = document.createElement("span");
        s.className = "ch" + (i % 3 === 1 ? " ch--outline" : "");
        s.textContent = ch;
        heroWord.appendChild(s);
    });
    heroChars = $$(".ch", heroWord);
}

/* initial hero states (loader hides the flash) */
const heroBits = ["#heroSmall", "#heroStandard", "#heroDesc", "#heroCta", ".hero-eyebrow", ".hero-meta-inner", "#heroBadge"].map(s => $(s)).filter(Boolean);
if (!RM) {
    gsap.set(heroChars, { yPercent: 130, rotate: 6 });
    gsap.set(heroBits, { autoAlpha: 0, y: 26 });
    gsap.set(heroWord, { overflow: "hidden", display: "block" });
}

/* ── preloader ─────────────────────────────────── */
function heroIntro(){
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(heroChars, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.045 })
      .to($(".hero-eyebrow"), { autoAlpha: 1, y: 0, duration: .8 }, "-=1.0")
      .to(["#heroSmall", "#heroStandard"].map(s=>$(s)), { autoAlpha: 1, y: 0, duration: .9, stagger: .12 }, "-=0.9")
      .to(["#heroDesc", "#heroCta"].map(s=>$(s)), { autoAlpha: 1, y: 0, duration: .8, stagger: .1 }, "-=0.6")
      .to([$(".hero-meta-inner"), $("#heroBadge")], { autoAlpha: 1, y: 0, duration: .8, stagger: .1 }, "-=0.5");
    startScramble();
}

if (loader && !RM) {
    const word = $("#loaderWord");
    if (word) {
        const t = word.textContent.trim();
        word.innerHTML = t.split("").map(c => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("");
    }
    const counter = { v: 0 };
    const countEl = $("#loaderCount");
    const tl = gsap.timeline({
        onComplete(){ loader.style.display = "none"; heroIntro(); }
    });
    tl.to($$("#loaderWord span"), { y: 0, yPercent: -0, duration: .9, ease: "expo.out", stagger: .03, onStart(){ gsap.set($$("#loaderWord span"), {display:"inline-block"}); }, startAt:{ yPercent: 110 } })
      .to(counter, { v: 100, duration: 1.4, ease: "power2.inOut",
          onUpdate(){ if (countEl) countEl.textContent = String(Math.round(counter.v)).padStart(2, "0"); } }, "<")
      .to($("#loaderLine"), { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, "<")
      .to($(".loader-inner"), { autoAlpha: 0, y: -30, duration: .5, ease: "power2.in" }, "+=0.15")
      .to($(".loader-panel--top"), { yPercent: -101, duration: .9, ease: "expo.inOut" }, "-=0.1")
      .to($(".loader-panel--bot"), { yPercent: 101, duration: .9, ease: "expo.inOut" }, "<");
} else if (!RM) {
    heroIntro();
}

/* ── text scramble (eyebrow) ───────────────────── */
function startScramble(){
    const el = $(".scramble");
    if (!el || RM) return;
    const target = el.dataset.scramble || el.textContent;
    const glyphs = "◆◇#/\\_—·ELANTECH";
    let frame = 0;
    const total = 34;
    const iv = setInterval(() => {
        frame++;
        const reveal = Math.floor((frame / total) * target.length);
        el.textContent = target.split("").map((c, i) =>
            i < reveal ? c : (c === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)])
        ).join("");
        if (frame >= total) { el.textContent = target; clearInterval(iv); }
    }, 32);
}

/* ── custom cursor ─────────────────────────────── */
if (!TOUCH && !RM) {
    const dot = $("#cursorDot"), ring = $("#cursorRing"), label = $("#cursorLabel");
    const dx = gsap.quickTo(dot, "x", { duration: .12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: .12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: .45, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: .45, ease: "power3" });
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    window.addEventListener("mousemove", e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    const hoverables = 'a, button, .faq-q, [data-cursor]';
    document.addEventListener("mouseover", e => {
        const t = e.target.closest(hoverables);
        if (!t) { ring.classList.remove("is-hover"); return; }
        label.textContent = t.closest(".folio-item") ? "View" : t.closest(".deck-card") ? "More" : "Go";
        ring.classList.add("is-hover");
    });
}

/* ── magnetic buttons ──────────────────────────── */
if (!TOUCH && !RM) {
    $$(".magnetic").forEach(el => {
        const xTo = gsap.quickTo(el, "x", { duration: .5, ease: "elastic.out(1,.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: .5, ease: "elastic.out(1,.4)" });
        el.addEventListener("mousemove", e => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * .35);
            yTo((e.clientY - (r.top + r.height / 2)) * .35);
        });
        el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
}

/* ── hero orb parallax (mouse + scroll) ────────── */
if (!RM) {
    const orbs = $$("[data-orb]");
    if (!TOUCH) {
        window.addEventListener("mousemove", e => {
            const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
            orbs.forEach(o => {
                const f = parseFloat(o.dataset.orb) * 1000;
                gsap.to(o, { x: nx * f, y: ny * f, duration: 1.6, ease: "power2.out" });
            });
        });
    }
    gsap.to(".hero-content", {
        yPercent: -12, autoAlpha: .25, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
}

/* ── marquees (velocity-reactive) ──────────────── */
function loopMarquee(track, dir){
    if (!track || RM) return;
    const tween = dir > 0
        ? gsap.fromTo(track, { xPercent: 0 },   { xPercent: -50, ease: "none", duration: 24, repeat: -1 })
        : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0,   ease: "none", duration: 24, repeat: -1 });
    ScrollTrigger.create({
        onUpdate(self){
            const v = Math.abs(self.getVelocity() / 260);
            gsap.to(tween, { timeScale: gsap.utils.clamp(1, 4, v), duration: .5, overwrite: true });
        }
    });
}
loopMarquee($("#marqueeTrack"), 1);
$$(".shop-mq-track").forEach(t => loopMarquee(t, parseFloat(t.dataset.mqDir || "1")));

/* ── manifesto word-by-word scrub ──────────────── */
const mani = $("#manifestoText");
if (mani) {
    const accents = (mani.dataset.accents || "").split(",").map(s => s.trim());
    const words = mani.textContent.trim().split(/\s+/);
    mani.innerHTML = words.map(w => {
        const clean = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
        const acc = accents.some(a => a && clean.includes(a));
        return `<span class="w${acc ? " w--accent" : ""}">${w}</span>`;
    }).join(" ");
    if (!RM) {
        gsap.to($$(".w", mani), {
            opacity: 1, ease: "none", stagger: .06,
            scrollTrigger: { trigger: mani, start: "top 80%", end: "bottom 55%", scrub: true }
        });
    }
}

/* ── stitch divider draw ───────────────────────── */
$$(".stitch-path").forEach(p => {
    if (RM) return;
    const len = p.getTotalLength ? p.getTotalLength() : 400;
    gsap.fromTo(p, { strokeDashoffset: len, strokeDasharray: `7 7` , opacity:.4},
        { strokeDashoffset: 0, opacity:1, duration: 1.4, ease: "power2.out",
          scrollTrigger: { trigger: p.closest(".stitch"), start: "top 88%" } });
});

/* ── services deck (sticky stack) ──────────────── */
const deckCards = $$(".deck-card");
const headH = 96;
deckCards.forEach((card, i) => {
    card.style.top = (headH + i * 16) + "px";
    card.style.zIndex = i + 1;
});
if (!RM) {
    ScrollTrigger.matchMedia({
        "(min-width: 861px)": function(){
            deckCards.forEach((card, i) => {
                if (i === deckCards.length - 1) return;
                gsap.to(card, {
                    scale: .93, filter: "brightness(.75)", transformOrigin: "50% 0%", ease: "none",
                    scrollTrigger: { trigger: deckCards[i + 1], start: "top bottom", end: "top " + (headH + i * 16 + 40) + "px", scrub: true }
                });
            });
        }
    });
}

/* ── counters ──────────────────────────────────── */
$$("[data-count]").forEach(el => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimal || "0", 10);
    if (RM) { el.textContent = end.toFixed(dec); return; }
    const obj = { v: 0 };
    ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter(){
            gsap.to(obj, { v: end, duration: 1.8, ease: "power3.out",
                onUpdate(){ el.textContent = obj.v.toFixed(dec); },
                onComplete(){ el.textContent = end.toFixed(dec); } });
        }
    });
});

/* ── process horizontal rail (desktop pin) ─────── */
if (!RM) {
    ScrollTrigger.matchMedia({
        "(min-width: 861px)": function(){
            const pin = $("#processPin"), track = $("#processTrack");
            if (!pin || !track) return;
            const dist = () => track.scrollWidth - document.documentElement.clientWidth;
            const st = gsap.to(track, {
                x: () => -dist(), ease: "none",
                scrollTrigger: {
                    trigger: pin, start: "top " + (headH + 20) + "px",
                    end: () => "+=" + dist(),
                    pin: true, scrub: 1, invalidateOnRefresh: true,
                    onUpdate(self){
                        gsap.set("#processProgress i", { scaleX: self.progress });
                        $$(".pstep-bar i").forEach((b, i, arr) => {
                            const per = 1 / arr.length;
                            gsap.set(b, { scaleX: gsap.utils.clamp(0, 1, (self.progress - i * per) / per) });
                        });
                    }
                }
            });
            return () => st.scrollTrigger && st.scrollTrigger.kill();
        }
    });
}

/* ── portfolio floating preview ────────────────── */
if (!TOUCH && !RM) {
    const prev = $("#folioPreview");
    if (prev) {
        const px = gsap.quickTo(prev, "x", { duration: .6, ease: "power3" });
        const py = gsap.quickTo(prev, "y", { duration: .6, ease: "power3" });
        gsap.set(prev, { xPercent: -50, yPercent: -50 });
        let active = false;
        window.addEventListener("mousemove", e => { if (active) { px(e.clientX); py(e.clientY); } });
        $$(".folio-item").forEach(item => {
            item.addEventListener("mouseenter", e => {
                active = true;
                px(e.clientX); py(e.clientY);
                $$(".fp-pane", prev).forEach(p => p.classList.toggle("active", p.dataset.pane === item.dataset.preview));
                gsap.to(prev, { autoAlpha: 1, scale: 1, duration: .45, ease: "expo.out", overwrite: true });
            });
            item.addEventListener("mouseleave", () => {
                active = false;
                gsap.to(prev, { autoAlpha: 0, scale: .9, duration: .35, ease: "power2.in", overwrite: true });
            });
        });
    }
}

/* ── testimonials autoplay ─────────────────────── */
(function(){
    const slides = $$(".testi-slide");
    const nav = $("#testiNav");
    if (!slides.length || !nav) return;
    let idx = 0, timer = null;
    const DUR = 6000;
    slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "testi-dot"; d.setAttribute("aria-label", "Testimonial " + (i + 1));
        d.innerHTML = "<i></i>";
        d.addEventListener("click", () => go(i, true));
        nav.appendChild(d);
    });
    const dots = $$(".testi-dot i", nav);
    function go(i, manual){
        slides[idx].classList.remove("active");
        idx = i % slides.length;
        slides[idx].classList.add("active");
        dots.forEach((d, j) => {
            gsap.killTweensOf(d);
            gsap.set(d, { scaleX: j < idx ? 1 : 0 });
        });
        if (!RM) gsap.fromTo(dots[idx], { scaleX: 0 }, { scaleX: 1, duration: DUR / 1000, ease: "none" });
        else gsap.set(dots[idx], { scaleX: 1 });
        clearTimeout(timer);
        timer = setTimeout(() => go(idx + 1), DUR);
    }
    go(0);
})();

/* ── FAQ accordion ─────────────────────────────── */
$$(".faq-item").forEach(item => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
        const open = item.classList.contains("open");
        $$(".faq-item.open").forEach(o => {
            if (o === item) return;
            o.classList.remove("open");
            $(".faq-q", o).setAttribute("aria-expanded", "false");
            gsap.to($(".faq-a", o), { height: 0, duration: .5, ease: "expo.out" });
        });
        item.classList.toggle("open", !open);
        q.setAttribute("aria-expanded", String(!open));
        gsap.to(a, { height: open ? 0 : "auto", duration: .55, ease: "expo.out" });
    });
});

/* ── reveal batch ──────────────────────────────── */
if (!RM) {
    ScrollTrigger.batch(".rv", {
        start: "top 88%",
        onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: .08, overwrite: true })
    });
    ScrollTrigger.addEventListener("refreshInit", () => {}); // keep layout fresh
} else {
    $$(".rv").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
}

/* ── footer wordmark parallax ──────────────────── */
if (!RM) {
    gsap.fromTo("#footerWord", { yPercent: 46 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true }
    });
}

/* ── header hide / progress / to-top ───────────── */
const header = $("#header"), progress = $("#scrollProgress"), toTop = $("#toTop");
let lastY = 0;
function onScroll(){
    const y = lenis ? lenis.scroll : (window.scrollY || 0);
    header.classList.toggle("is-scrolled", y > 40);
    header.classList.toggle("is-hidden", y > 500 && y > lastY && !$("#mmenu").classList.contains("is-open"));
    toTop.classList.toggle("show", y > 900);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    lastY = y;
}
if (lenis) lenis.on("scroll", onScroll);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ── mobile menu ───────────────────────────────── */
const burger = $("#burger"), mmenu = $("#mmenu");
if (burger && mmenu) {
    burger.addEventListener("click", () => {
        const open = mmenu.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(open));
        mmenu.setAttribute("aria-hidden", String(!open));
        document.body.style.overflow = open ? "hidden" : "";
        if (lenis) open ? lenis.stop() : lenis.start();
    });
    $$("a", mmenu).forEach(a => a.addEventListener("click", () => burger.click()));
}

/* ── keep triggers honest after fonts/embeds load ── */
window.addEventListener("load", () => ScrollTrigger.refresh());
setTimeout(() => ScrollTrigger.refresh(), 2500);

})();
