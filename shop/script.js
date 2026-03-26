/**
 * ═══════════════════════════════════════════════════════════════
 *  ETW SHOP V3 — Fully Standalone · Square Checkout Integrated
 *  3D tilt · Cursor glow · Particles · Magnetic buttons ·
 *  View transitions · Cart → Square Checkout · iPhones 12–16
 *  File: shop/script.js — ZERO dependencies
 * ═══════════════════════════════════════════════════════════════
 */

const Q = (s, p = document) => p.querySelector(s);
const QA = (s, p = document) => [...p.querySelectorAll(s)];
const throttle = (fn, ms) => { let l = 0; return (...a) => { const n = Date.now(); if (n - l >= ms) { l = n; fn(...a); } }; };

/* ── Square Checkout Endpoint ── */
const CHECKOUT_API = 'https://www.elanstechworld.com/api/create-checkout';

/* ═══════════════════════════════════════
   PRODUCT DATA
═══════════════════════════════════════ */
const P = [
  // ── iPhones ──
  { id:'ip16pro256', name:'iPhone 16 Pro', cat:'iphone', stor:'256GB', color:'Natural Titanium', cond:'excellent', price:849, retail:1099, bm:939, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A18 Pro','256GB','48MP Camera'], feat:true },
  { id:'ip16-128', name:'iPhone 16', cat:'iphone', stor:'128GB', color:'Ultramarine', cond:'excellent', price:599, retail:829, bm:669, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A18','128GB','48MP Camera'] },
  { id:'ip15promax', name:'iPhone 15 Pro Max', cat:'iphone', stor:'256GB', color:'Blue Titanium', cond:'excellent', price:779, retail:1199, bm:869, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-finish-select-202309-6-7inch-bluetitanium?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A17 Pro','256GB','5x Zoom'] },
  { id:'ip15pro', name:'iPhone 15 Pro', cat:'iphone', stor:'128GB', color:'Natural Titanium', cond:'good', price:619, retail:999, bm:699, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A17 Pro','128GB','48MP'] },
  { id:'ip15-128', name:'iPhone 15', cat:'iphone', stor:'128GB', color:'Black', cond:'good', price:449, retail:799, bm:519, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A16','128GB','48MP'] },
  { id:'ip14promax', name:'iPhone 14 Pro Max', cat:'iphone', stor:'256GB', color:'Deep Purple', cond:'good', price:549, retail:1099, bm:629, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-max-finish-select-202209-6-7inch-deeppurple?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A16','256GB','48MP'] },
  { id:'ip14-128', name:'iPhone 14', cat:'iphone', stor:'128GB', color:'Midnight', cond:'good', price:349, retail:699, bm:399, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A15','128GB','12MP'] },
  { id:'ip13pro', name:'iPhone 13 Pro', cat:'iphone', stor:'128GB', color:'Sierra Blue', cond:'fair', price:349, retail:999, bm:409, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-blue-select?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A15','128GB','12MP ProRes'] },
  { id:'ip13-128', name:'iPhone 13', cat:'iphone', stor:'128GB', color:'Midnight', cond:'fair', price:269, retail:699, bm:319, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-midnight-select-2021?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A15','128GB','12MP'] },
  { id:'ip12pro', name:'iPhone 12 Pro', cat:'iphone', stor:'128GB', color:'Pacific Blue', cond:'fair', price:259, retail:899, bm:309, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-blue-hero?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A14','128GB','12MP LiDAR'] },
  { id:'ip12-64', name:'iPhone 12', cat:'iphone', stor:'64GB', color:'Blue', cond:'fair', price:199, retail:699, bm:239, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A14','64GB','12MP'] },

  // ── MacBooks ──
  { id:'mbairm3', name:'MacBook Air M3', cat:'macbook', stor:'256GB', color:'Midnight', cond:'excellent', price:849, retail:1099, bm:949, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=400&hei=300&fmt=p-jpg&qlt=80', specs:['M3 Chip','8GB RAM','256GB SSD'] },
  { id:'mbpro14m3', name:'MacBook Pro 14" M3', cat:'macbook', stor:'512GB', color:'Space Black', cond:'excellent', price:1249, retail:1599, bm:1399, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=400&hei=300&fmt=p-jpg&qlt=80', specs:['M3 Pro','18GB RAM','512GB SSD'] },
  { id:'mbairm2', name:'MacBook Air M2', cat:'macbook', stor:'256GB', color:'Starlight', cond:'good', price:699, retail:999, bm:789, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-starlight-select-20220606?wid=400&hei=300&fmt=p-jpg&qlt=80', specs:['M2 Chip','8GB RAM','256GB SSD'] },
  { id:'mbairm1', name:'MacBook Air M1', cat:'macbook', stor:'256GB', color:'Space Gray', cond:'fair', price:479, retail:799, bm:549, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-201810?wid=400&hei=300&fmt=p-jpg&qlt=80', specs:['M1 Chip','8GB RAM','256GB SSD'] },

  // ── iPads ──
  { id:'ipadairm2', name:'iPad Air M2', cat:'ipad', stor:'128GB', color:'Starlight', cond:'excellent', price:449, retail:599, bm:509, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-starlight-202405?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['M2 Chip','128GB','11" Liquid Retina'] },
  { id:'ipad10', name:'iPad 10th Gen', cat:'ipad', stor:'64GB', color:'Blue', cond:'good', price:269, retail:449, bm:309, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A14','64GB','10.9" Display'] },
  { id:'ipad9', name:'iPad 9th Gen', cat:'ipad', stor:'64GB', color:'Space Gray', cond:'fair', price:179, retail:329, bm:209, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2021-702702702?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['A13','64GB','10.2" Retina'] },

  // ── Watch ──
  { id:'wu2', name:'Apple Watch Ultra 2', cat:'watch', stor:'64GB', color:'Titanium', cond:'excellent', price:549, retail:799, bm:619, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-49-titanium-702702702_VW_34FR_WF_CO?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['S9 Chip','GPS + Cellular','49mm'] },
  { id:'ws10', name:'Apple Watch Series 10', cat:'watch', stor:'64GB', color:'Jet Black', cond:'excellent', price:329, retail:429, bm:369, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s10-702702702?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['S10 Chip','GPS','46mm'] },
  { id:'wse2', name:'Apple Watch SE 2', cat:'watch', stor:'32GB', color:'Midnight', cond:'good', price:149, retail:249, bm:179, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MNTE3ref_VW_34FR+watch-40-alum-midnight-702702702_VW_34FR_WF_CO?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['S8 Chip','GPS','40mm'] },

  // ── AirPods ──
  { id:'app2', name:'AirPods Pro 2 (USB-C)', cat:'airpods', stor:'', color:'White', cond:'excellent', price:159, retail:249, bm:179, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['H2 Chip','ANC','USB-C'] },
  { id:'apm', name:'AirPods Max (USB-C)', cat:'airpods', stor:'', color:'Midnight', cond:'good', price:379, retail:549, bm:429, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['H2 Chip','ANC','USB-C'] },
  { id:'ap4', name:'AirPods 4', cat:'airpods', stor:'', color:'White', cond:'excellent', price:99, retail:129, bm:115, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-4-hero-select-202409?wid=400&hei=472&fmt=p-jpg&qlt=80', specs:['H2 Chip','Open Ear','USB-C'] },
];

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
const revealSeen = new Set();
function reveal(els){
  if(!els||!els.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !revealSeen.has(e.target)){
        revealSeen.add(e.target);
        const d = parseInt(e.target.dataset.d||0);
        setTimeout(()=>e.target.classList.add('vis'),d);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
  els.forEach(el=>obs.observe(el));
}
function initReveal(){ reveal(QA('[data-sh]')); }

/* ═══════════════════════════════════════
   SCROLL PROGRESS
═══════════════════════════════════════ */
function initProgress(){
  const bar = Q('#shProgress'); if(!bar) return;
  window.addEventListener('scroll',throttle(()=>{
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h>0?window.scrollY/h:0})`;
  },30));
}

/* ═══════════════════════════════════════
   HEADER
═══════════════════════════════════════ */
function initHeader(){
  const h = Q('#shHeader'); if(!h) return;
  window.addEventListener('scroll',throttle(()=> h.classList.toggle('scrolled',window.scrollY>40),80));
}

/* ═══════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════ */
function initMobile(){
  const btn=Q('#shMenuBtn'),mob=Q('#shMob'),ov=Q('.sh-mob-overlay');
  if(!btn||!mob) return;
  const toggle=()=>{
    btn.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open')?'hidden':'';
  };
  const close=()=>{ btn.classList.remove('open'); mob.classList.remove('open'); document.body.style.overflow=''; };
  btn.addEventListener('click',toggle);
  ov?.addEventListener('click',close);
  QA('a',mob).forEach(a=>a.addEventListener('click',close));
}

/* ═══════════════════════════════════════
   CURSOR GLOW
═══════════════════════════════════════ */
function initGlow(){
  if(window.innerWidth<768) return;
  const g=Q('#shGlow'); if(!g) return;
  let mx=0,my=0,cx=0,cy=0,active=false;
  document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; });
  document.addEventListener('mouseenter',()=>{ active=true; g.classList.add('on'); });
  document.addEventListener('mouseleave',()=>{ active=false; g.classList.remove('on'); });
  (function loop(){
    if(active){ cx+=(mx-cx)*.08; cy+=(my-cy)*.08; g.style.left=cx+'px'; g.style.top=cy+'px'; }
    requestAnimationFrame(loop);
  })();
}

/* ═══════════════════════════════════════
   PARTICLES
═══════════════════════════════════════ */
function initParticles(){
  const c=Q('#shParticles'); if(!c) return;
  // Don't duplicate particles
  if(c.children.length>0) return;
  const n = window.innerWidth<768?12:30;
  const colors=['rgba(0,113,227,.4)','rgba(90,200,250,.3)','rgba(191,90,242,.3)','rgba(52,199,89,.25)','rgba(191,162,106,.2)'];
  for(let i=0;i<n;i++){
    const el=document.createElement('div');
    el.className='sh-particle';
    const x=Math.random()*100, y=30+Math.random()*70, sz=1.5+Math.random()*3;
    const dur=10+Math.random()*16, delay=Math.random()*dur;
    const dx=-80+Math.random()*160, dy=-(100+Math.random()*300), peak=.08+Math.random()*.3;
    el.style.cssText=`left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:${colors[i%colors.length]};--dur:${dur}s;--delay:-${delay}s;--dx:${dx}px;--dy:${dy}px;--peak:${peak};`;
    c.appendChild(el);
  }
}

/* ═══════════════════════════════════════
   HERO BADGES
═══════════════════════════════════════ */
function initBadges(){
  QA('.sh-fbadge').forEach((b,i)=>{
    if(!b.classList.contains('show'))
      setTimeout(()=>b.classList.add('show'),900+i*350);
  });
}

/* ═══════════════════════════════════════
   HERO PARALLAX
═══════════════════════════════════════ */
let heroRAF = null;
function initHeroParallax(){
  const float=Q('#shHeroFloat'), hero=Q('#shHero');
  if(!float||!hero||window.innerWidth<768) return;
  let mx=.5,my=.5,cx=.5,cy=.5;
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    mx=(e.clientX-r.left)/r.width; my=(e.clientY-r.top)/r.height;
  });
  hero.addEventListener('mouseleave',()=>{mx=.5;my=.5});
  if(heroRAF) cancelAnimationFrame(heroRAF);
  (function loop(){
    cx+=(mx-cx)*.04; cy+=(my-cy)*.04;
    const ry=(cx-.5)*12, rx=(cy-.5)*-8;
    float.style.transform=`translateY(${Math.sin(Date.now()/1000)*10}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    heroRAF = requestAnimationFrame(loop);
  })();
}

/* ═══════════════════════════════════════
   3D CARD TILT
═══════════════════════════════════════ */
function bindCardTilt(){
  if(window.innerWidth<768) return;
  QA('.sh-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(800px) rotateX(${y*-8}deg) rotateY(${x*8}deg) translateY(-6px)`;
      const glow=Q('.sh-card-glow',card);
      if(glow){ glow.style.setProperty('--mx',(e.clientX-r.left)+'px'); glow.style.setProperty('--my',(e.clientY-r.top)+'px'); }
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transition='transform .5s cubic-bezier(.25,.46,.45,.94)';
      card.style.transform='perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      setTimeout(()=>card.style.transition='',500);
    });
  });
}

/* ═══════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════ */
function initMagnetic(){
  if(window.innerWidth<768) return;
  QA('.btn-primary, .btn-dark').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)*.25;
      const dy=(e.clientY-r.top-r.height/2)*.25;
      btn.style.transform=`translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave',()=>{
      btn.style.transition='transform .4s cubic-bezier(.34,1.56,.64,1)';
      btn.style.transform='translate(0,0)';
      setTimeout(()=>btn.style.transition='',400);
    });
  });
}

/* ═══════════════════════════════════════
   PRODUCT GRID
═══════════════════════════════════════ */
let activeFilter = 'all';

function renderGrid(products){
  const grid = Q('#shGrid'); if(!grid) return;
  if(!products.length){
    grid.innerHTML='<div class="sh-empty"><i class="fas fa-search"></i><p>No products found.</p></div>';
    return;
  }
  grid.innerHTML = products.map((p,i)=>{
    const pct=Math.round(((p.retail-p.price)/p.retail)*100);
    const cc = p.cond==='excellent'?'sh-cond-excellent':p.cond==='good'?'sh-cond-good':'sh-cond-fair';
    const cl = p.cond[0].toUpperCase()+p.cond.slice(1);
    return `
    <div class="sh-card" data-sh="up" data-d="${Math.min(i*50,250)}" data-id="${p.id}">
      <div class="sh-card-glow"></div>
      <span class="sh-cond ${cc}">${cl}</span>
      ${pct>=25?`<span class="sh-save">-${pct}%</span>`:''}
      <div class="sh-card-img">
        <img src="${p.img}" alt="${p.name} ${p.stor}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/400x472/F5F5F7/1D1D1F?text=${encodeURIComponent(p.name)}'">
        <div class="sh-card-quick"><button class="sh-qbtn" data-add="${p.id}"><i class="fas fa-bag-shopping"></i> Add to Bag</button></div>
      </div>
      <div class="sh-card-info">
        <div class="sh-card-cat">${p.cat}</div>
        <h3 class="sh-card-name">${p.name}${p.stor?' · '+p.stor:''}</h3>
        <div class="sh-card-specs">${p.specs.map(s=>`<span class="sh-card-spec">${s}</span>`).join('')}</div>
        <div class="sh-card-prices">
          <span class="sh-card-price">$${p.price}</span>
          <span class="sh-card-orig">$${p.retail}</span>
          <span class="sh-card-saved">Save $${p.retail-p.price}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  revealSeen.clear();
  reveal(QA('[data-sh]',grid));

  QA('.sh-card',grid).forEach(card=>{
    card.addEventListener('click',e=>{
      if(e.target.closest('[data-add]')) return;
      showProduct(card.dataset.id);
    });
  });

  QA('[data-add]',grid).forEach(btn=>{
    btn.addEventListener('click',e=>{ e.stopPropagation(); cartAdd(btn.dataset.add); });
  });

  bindCardTilt();
}

function applyFilter(){
  const filtered = activeFilter==='all' ? P : P.filter(p=>p.cat===activeFilter);
  renderGrid(filtered);
}

function initFilters(){
  const wrap=Q('#shFilters'); if(!wrap) return;
  QA('.sh-fbtn',wrap).forEach(btn=>{
    btn.addEventListener('click',()=>{
      activeFilter = btn.dataset.filter;
      QA('.sh-fbtn',wrap).forEach(b=>b.classList.toggle('active',b===btn));
      applyFilter();
    });
  });

  QA('[data-f]').forEach(link=>{
    link.addEventListener('click',e=>{
      e.preventDefault();
      activeFilter = link.dataset.f;
      const wrap2=Q('#shFilters');
      if(wrap2) QA('.sh-fbtn',wrap2).forEach(b=>b.classList.toggle('active',b.dataset.filter===activeFilter));
      if(isDetailView) hideProduct();
      applyFilter();
      const sec=Q('#products');
      if(sec) setTimeout(()=>window.scrollTo({top:sec.offsetTop-60,behavior:'smooth'}),100);
    });
  });
}

/* ═══════════════════════════════════════
   PRODUCT DETAIL
═══════════════════════════════════════ */
let isDetailView = false;
let gridSnapshot = null;

function showProduct(id){
  const p = P.find(x=>x.id===id); if(!p) return;
  const view = Q('#shopView'); if(!view) return;

  if(!gridSnapshot) gridSnapshot = view.innerHTML;
  isDetailView = true;
  history.pushState({product:id},'',`#product/${id}`);

  const pct=Math.round(((p.retail-p.price)/p.retail)*100);
  const bmDiff = p.bm-p.price;
  const cc = p.cond==='excellent'?'sh-cond-excellent':p.cond==='good'?'sh-cond-good':'sh-cond-fair';
  const cl = p.cond[0].toUpperCase()+p.cond.slice(1);
  const labels=['Processor','Storage','Feature'];

  view.innerHTML=`
  <div class="sp-wrap">
    <div class="container">
      <button class="sp-back" id="spBack"><i class="fas fa-arrow-left"></i> Back to Shop</button>
      <div class="sp-layout">
        <div class="sp-gallery"><div class="sp-gallery-main"><img src="${p.img}" alt="${p.name}"></div></div>
        <div class="sp-info">
          <span class="sp-cond-tag ${cc}">${cl} Condition</span>
          <h1>${p.name}</h1>
          <p class="sp-sub">${p.stor?p.stor+' · ':''}${p.color} · Refurbished</p>
          <div class="sp-price-row">
            <span class="sp-price">$${p.price}</span>
            <span class="sp-orig">$${p.retail}</span>
            <span class="sp-save-tag">Save ${pct}%</span>
          </div>
          <div class="sp-cmp">
            <i class="fas fa-scale-balanced"></i>
            <span>Back Market: <strong>$${p.bm}</strong></span>
            <span>→ You save <span class="sp-cmp-diff">$${bmDiff} more</span> with us</span>
          </div>
          <div class="sp-div"></div>
          <div class="sp-specs">
            ${p.specs.map((s,i)=>`<div class="sp-spec"><div class="sp-spec-l">${labels[i]||'Detail'}</div><div class="sp-spec-v">${s}</div></div>`).join('')}
            <div class="sp-spec"><div class="sp-spec-l">Condition</div><div class="sp-spec-v">${cl}</div></div>
          </div>
          <div class="sp-ctas">
            <button class="sp-cta-main" id="spAdd"><i class="fas fa-bag-shopping"></i> Add to Bag — $${p.price}</button>
            <a href="tel:+19294176819" class="sp-cta-call"><i class="fas fa-phone"></i> Questions? (929) 417-6819</a>
          </div>
          <div class="sp-div"></div>
          <div class="sp-trust">
            <div class="sp-trust-row"><i class="fas fa-check-circle"></i> 90-day warranty included</div>
            <div class="sp-trust-row"><i class="fas fa-check-circle"></i> 44-point inspection certified</div>
            <div class="sp-trust-row"><i class="fas fa-check-circle"></i> Free NYC same-day delivery</div>
            <div class="sp-trust-row"><i class="fas fa-check-circle"></i> 14-day free returns</div>
            <div class="sp-trust-row"><i class="fas fa-check-circle"></i> Secure Square checkout</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  window.scrollTo({top:0,behavior:'smooth'});
  document.title = `${p.name} ${p.stor||''} — ETW Shop`;
  Q('#spBack')?.addEventListener('click',()=>hideProduct());
  Q('#spAdd')?.addEventListener('click',()=>cartAdd(p.id));
}

function hideProduct(){
  const view = Q('#shopView'); if(!view||!gridSnapshot) return;
  view.innerHTML = gridSnapshot;
  gridSnapshot = null;
  isDetailView = false;
  history.pushState(null,'',window.location.pathname);
  document.title = 'Shop Refurbished Apple | ETW Shop';

  // Re-init everything cleanly
  revealSeen.clear();
  reveal(QA('[data-sh]'));
  initFilters();
  applyFilter();
  initBadges();
  initParticles();
  initHeroParallax();
  initMagnetic();
}

window.addEventListener('popstate',e=>{
  if(e.state && e.state.product) showProduct(e.state.product);
  else if(isDetailView) hideProduct();
});

function checkHash(){
  const h = window.location.hash;
  if(h.startsWith('#product/')){
    setTimeout(()=>showProduct(h.replace('#product/','')),300);
  }
}

/* ═══════════════════════════════════════
   COMPARISON TABLE
═══════════════════════════════════════ */
function initCompare(){
  const tbody = Q('#shCmp tbody'); if(!tbody) return;
  const ids=['ip16pro256','ip15promax','ip14promax','mbairm3','ipadairm2','app2'];
  tbody.innerHTML = ids.map(id=>{
    const p=P.find(x=>x.id===id); if(!p) return '';
    return `<tr><td><strong>${p.name}</strong> ${p.stor}</td><td>$${p.bm}</td><td>$${p.price} <span class="sh-cmp-save">−$${p.bm-p.price}</span></td></tr>`;
  }).join('');
}

/* ═══════════════════════════════════════
   CART + SQUARE CHECKOUT
═══════════════════════════════════════ */
let cartItems = [];
try{ const s=sessionStorage.getItem('sh_cart'); if(s) cartItems=JSON.parse(s); }catch(e){}

function cartSave(){ try{sessionStorage.setItem('sh_cart',JSON.stringify(cartItems))}catch(e){} }

function cartAdd(id){
  const ex=cartItems.find(i=>i.id===id);
  if(ex) ex.qty++; else cartItems.push({id,qty:1});
  cartSave(); cartUI(); cartToast(id); cartOpen();
}

function cartRemove(id){
  cartItems=cartItems.filter(i=>i.id!==id);
  cartSave(); cartUI();
}

function cartTotal(){ return cartItems.reduce((s,i)=>{ const p=P.find(x=>x.id===i.id); return s+(p?p.price*i.qty:0); },0); }
function cartCount(){ return cartItems.reduce((s,i)=>s+i.qty,0); }

function cartUI(){
  const count=cartCount(), total=cartTotal();
  const countEl=Q('#shCount'), bodyEl=Q('#shCartBody'), footEl=Q('#shCartFoot'), totalEl=Q('#shCartTotal');

  if(countEl){ countEl.textContent=count; countEl.classList.toggle('show',count>0); }

  if(bodyEl){
    if(!cartItems.length){
      bodyEl.innerHTML='<div class="sh-cart-empty"><i class="fas fa-bag-shopping"></i><p>Your bag is empty.</p></div>';
      if(footEl) footEl.style.display='none';
    } else {
      bodyEl.innerHTML=cartItems.map(item=>{
        const p=P.find(x=>x.id===item.id); if(!p) return '';
        return `<div class="sh-cart-item">
          <div class="sh-cart-item-img"><img src="${p.img}" alt="${p.name}"></div>
          <div class="sh-cart-item-info">
            <div class="sh-cart-item-name">${p.name}</div>
            <div class="sh-cart-item-var">${p.stor?p.stor+' · ':''}${p.color} · Qty: ${item.qty}</div>
            <div class="sh-cart-item-price">$${(p.price*item.qty).toLocaleString()}</div>
          </div>
          <button class="sh-cart-item-rm" data-rm="${p.id}"><i class="fas fa-trash-can"></i></button>
        </div>`;
      }).join('');
      if(footEl) footEl.style.display='block';
      QA('[data-rm]',bodyEl).forEach(btn=>btn.addEventListener('click',()=>cartRemove(btn.dataset.rm)));
    }
  }
  if(totalEl) totalEl.textContent='$'+total.toLocaleString();
}

function cartOpen(){
  Q('#shCartDrawer')?.classList.add('open');
  Q('#shCartOv')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function cartClose(){
  Q('#shCartDrawer')?.classList.remove('open');
  Q('#shCartOv')?.classList.remove('open');
  document.body.style.overflow='';
}

function cartToast(id){
  const p=P.find(x=>x.id===id), t=Q('#shToast'), m=Q('#shToastMsg');
  if(!p||!t||!m) return;
  m.textContent=`${p.name} added to bag!`;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

/* ── Square Checkout Handler ── */
async function handleCheckout(){
  const btn = Q('#shCheckout');
  if(!cartItems.length || !btn) return;

  // Loading state
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating checkout…';
  btn.disabled = true;
  btn.style.opacity = '.7';
  btn.style.pointerEvents = 'none';

  try {
    // Build items for the API
    const items = cartItems.map(item=>{
      const p = P.find(x=>x.id===item.id);
      if(!p) return null;
      return {
        name: `${p.name}${p.stor?' '+p.stor:''} (${p.cond})`,
        qty: item.qty,
        price: p.price,
        variant: `${p.color} · Refurbished · ${p.cond}`,
      };
    }).filter(Boolean);

    if(!items.length) throw new Error('No valid items in cart');

    const res = await fetch(CHECKOUT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        redirectUrl: window.location.origin + '/shop/?order=success',
      }),
    });

    const data = await res.json();

    if(!res.ok) throw new Error(data.detail || data.error || 'Checkout failed');

    // Redirect to Square hosted checkout
    window.location.href = data.url;

  } catch(err){
    console.error('Checkout error:', err);
    alert(`Checkout error: ${err.message}\n\nPlease call (929) 417-6819 to complete your order.`);
    btn.innerHTML = orig;
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  }
}

/* ── Detect return from successful payment ── */
function checkOrderSuccess(){
  const params = new URLSearchParams(window.location.search);
  if(params.get('order') === 'success'){
    // Clear cart
    cartItems = [];
    cartSave();
    cartUI();

    // Show success message
    const t=Q('#shToast'), m=Q('#shToastMsg');
    if(t&&m){
      m.textContent = "Order placed! We'll be in touch shortly.";
      t.classList.add('show');
      setTimeout(()=>t.classList.remove('show'),6000);
    }

    // Clean URL
    history.replaceState(null,'',window.location.pathname);
  }
}

function initCart(){
  Q('#shCartBtn')?.addEventListener('click',cartOpen);
  Q('#shCartX')?.addEventListener('click',cartClose);
  Q('#shCartOv')?.addEventListener('click',cartClose);
  Q('#shCheckout')?.addEventListener('click',handleCheckout);
  cartUI();
}

/* ═══════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════ */
function initSmooth(){
  document.addEventListener('click',e=>{
    const link = e.target.closest('a[href^="#"]');
    if(!link) return;
    const href=link.getAttribute('href');
    if(href==='#'||href.startsWith('#product/')) return;
    const t=Q(href);
    if(t){ e.preventDefault(); window.scrollTo({top:t.offsetTop-60,behavior:'smooth'}); }
  });
}

/* ═══════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════ */
function initTop(){
  const btn=Q('#shTop'); if(!btn) return;
  window.addEventListener('scroll',throttle(()=>btn.classList.toggle('vis',window.scrollY>600),200));
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ═══════════════════════════════════════
   BOOT
═══════════════════════════════════════ */
function boot(){
  checkOrderSuccess();   // ← Check if returning from Square payment
  initReveal();
  initProgress();
  initHeader();
  initMobile();
  initGlow();
  initParticles();
  initBadges();
  initHeroParallax();
  initMagnetic();
  renderGrid(P);
  initFilters();
  initCart();
  initCompare();
  initSmooth();
  initTop();
  checkHash();
  console.log('✦ ETW Shop V3 — Square Checkout Ready');
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();
