/**
 * ═══════════════════════════════════════════════════════════════
 *  ETW SHOP — Interaction Engine
 *  Product grid · Cart drawer · Filters · Scroll reveal ·
 *  Product detail view · Price comparison · Toast · Smooth scroll
 *  File: shop/script.js
 *  Depends on: ../js/script.js (header, loader, mobile menu)
 * ═══════════════════════════════════════════════════════════════
 */

// ─── UTILITIES ────────────────────────────────────────────────
const sh = (s, p = document) => p.querySelector(s);
const shAll = (s, p = document) => [...p.querySelectorAll(s)];
const shThrottle = (fn, ms) => { let l = 0; return (...a) => { const n = Date.now(); if (n - l >= ms) { l = n; fn(...a); } }; };

// ─── PRODUCT DATA ─────────────────────────────────────────────
// Replace images with your actual product photos
const PRODUCTS = [
  {
    id: 'iphone-16-pro-256',
    name: 'iPhone 16 Pro',
    category: 'iphone',
    storage: '256GB',
    color: 'Natural Titanium',
    condition: 'excellent',
    price: 849,
    retail: 1099,
    backMarket: 939,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['A18 Pro', '256GB', '48MP Camera'],
    featured: true,
  },
  {
    id: 'iphone-16-128',
    name: 'iPhone 16',
    category: 'iphone',
    storage: '128GB',
    color: 'Ultramarine',
    condition: 'excellent',
    price: 599,
    retail: 829,
    backMarket: 669,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['A18', '128GB', '48MP Camera'],
  },
  {
    id: 'iphone-15-pro-max-256',
    name: 'iPhone 15 Pro Max',
    category: 'iphone',
    storage: '256GB',
    color: 'Blue Titanium',
    condition: 'excellent',
    price: 779,
    retail: 1199,
    backMarket: 869,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-finish-select-202309-6-7inch-bluetitanium?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['A17 Pro', '256GB', '5x Zoom'],
  },
  {
    id: 'iphone-15-128',
    name: 'iPhone 15',
    category: 'iphone',
    storage: '128GB',
    color: 'Black',
    condition: 'good',
    price: 489,
    retail: 799,
    backMarket: 549,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['A16', '128GB', '48MP'],
  },
  {
    id: 'iphone-14-128',
    name: 'iPhone 14',
    category: 'iphone',
    storage: '128GB',
    color: 'Midnight',
    condition: 'good',
    price: 379,
    retail: 699,
    backMarket: 429,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['A15', '128GB', '12MP'],
  },
  {
    id: 'macbook-air-m3-256',
    name: 'MacBook Air M3',
    category: 'macbook',
    storage: '256GB',
    color: 'Midnight',
    condition: 'excellent',
    price: 849,
    retail: 1099,
    backMarket: 949,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=400&hei=300&fmt=p-jpg&qlt=80',
    specs: ['M3 Chip', '8GB RAM', '256GB SSD'],
  },
  {
    id: 'macbook-pro-m3-512',
    name: 'MacBook Pro 14" M3',
    category: 'macbook',
    storage: '512GB',
    color: 'Space Black',
    condition: 'excellent',
    price: 1249,
    retail: 1599,
    backMarket: 1399,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=400&hei=300&fmt=p-jpg&qlt=80',
    specs: ['M3 Pro', '18GB RAM', '512GB SSD'],
  },
  {
    id: 'ipad-air-m2-128',
    name: 'iPad Air M2',
    category: 'ipad',
    storage: '128GB',
    color: 'Starlight',
    condition: 'excellent',
    price: 449,
    retail: 599,
    backMarket: 509,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-starlight-202405?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['M2 Chip', '128GB', '11" Liquid Retina'],
  },
  {
    id: 'ipad-10th-64',
    name: 'iPad 10th Gen',
    category: 'ipad',
    storage: '64GB',
    color: 'Blue',
    condition: 'good',
    price: 269,
    retail: 449,
    backMarket: 309,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['A14', '64GB', '10.9" Display'],
  },
  {
    id: 'watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    category: 'watch',
    storage: '64GB',
    color: 'Titanium',
    condition: 'excellent',
    price: 549,
    retail: 799,
    backMarket: 619,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-49-titanium-702702702_VW_34FR_WF_CO?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['S9 Chip', 'GPS + Cellular', '49mm'],
  },
  {
    id: 'watch-se-2',
    name: 'Apple Watch SE (2nd Gen)',
    category: 'watch',
    storage: '32GB',
    color: 'Midnight',
    condition: 'good',
    price: 159,
    retail: 249,
    backMarket: 179,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MNTE3ref_VW_34FR+watch-40-alum-midnight-702702702_VW_34FR_WF_CO?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['S8 Chip', 'GPS', '40mm'],
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2 (USB-C)',
    category: 'airpods',
    storage: '',
    color: 'White',
    condition: 'excellent',
    price: 159,
    retail: 249,
    backMarket: 179,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=400&hei=472&fmt=p-jpg&qlt=80',
    specs: ['H2 Chip', 'ANC', 'USB-C'],
  },
];

// ─── SCROLL REVEAL ────────────────────────────────────────────
class ShReveal {
  constructor() { this.seen = new Set(); }

  init() { this.observe(shAll('[data-sh-reveal]')); }

  observe(els) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !this.seen.has(e.target)) {
          this.seen.add(e.target);
          const d = parseInt(e.target.dataset.shDelay || 0);
          setTimeout(() => e.target.classList.add('sh-visible'), d);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => obs.observe(el));
  }
}

// ─── SCROLL PROGRESS ──────────────────────────────────────────
class ShProgress {
  init() {
    const bar = sh('#shScrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', shThrottle(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    }, 30));
  }
}

// ─── HERO BADGES STAGGER ──────────────────────────────────────
class ShHeroBadges {
  init() {
    shAll('.sh-hero-badge').forEach((b, i) => {
      setTimeout(() => b.classList.add('sh-badge-show'), 800 + i * 300);
    });
  }
}

// ─── PRODUCT GRID ─────────────────────────────────────────────
class ShProductGrid {
  constructor(reveal) {
    this.grid = sh('#shProductsGrid');
    this.filtersWrap = sh('#shFilters');
    this.active = 'all';
    this.reveal = reveal;
  }

  init() {
    if (!this.grid) return;
    this.render(PRODUCTS);
    this.bindFilterBtns();
    this.bindNavFilters();
  }

  render(products) {
    if (!products.length) {
      this.grid.innerHTML = '<div class="sh-no-results"><i class="fas fa-search"></i><p>No products found.</p></div>';
      return;
    }

    this.grid.innerHTML = products.map((p, i) => {
      const savePct = Math.round(((p.retail - p.price) / p.retail) * 100);
      const condCls = p.condition === 'excellent' ? 'sh-cond-excellent' : p.condition === 'good' ? 'sh-cond-good' : 'sh-cond-fair';
      const condTxt = p.condition.charAt(0).toUpperCase() + p.condition.slice(1);

      return `
        <div class="sh-product-card" data-sh-reveal="up" data-sh-delay="${Math.min(i * 60, 300)}" data-id="${p.id}">
          <span class="sh-product-condition ${condCls}">${condTxt}</span>
          ${savePct >= 20 ? `<span class="sh-product-save">Save ${savePct}%</span>` : ''}
          <div class="sh-product-image">
            <img src="${p.image}" alt="${p.name} ${p.storage}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/400x472/F5F5F7/1D1D1F?text=${encodeURIComponent(p.name)}'">
            <div class="sh-product-quick">
              <button class="sh-quick-btn" data-add="${p.id}"><i class="fas fa-bag-shopping"></i> Add to Bag</button>
            </div>
          </div>
          <div class="sh-product-info">
            <div class="sh-product-category">${p.category}</div>
            <h3 class="sh-product-name">${p.name}${p.storage ? ' · ' + p.storage : ''}</h3>
            <div class="sh-product-specs">${p.specs.map(s => `<span class="sh-product-spec">${s}</span>`).join('')}</div>
            <div class="sh-product-price-row">
              <span class="sh-product-price">$${p.price}</span>
              <span class="sh-product-orig">$${p.retail}</span>
              <span class="sh-product-save-tag">Save $${p.retail - p.price}</span>
            </div>
          </div>
        </div>`;
    }).join('');

    // Reveal new cards
    this.reveal.observe(shAll('[data-sh-reveal]', this.grid));

    // Bind card clicks → product detail
    shAll('.sh-product-card', this.grid).forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-add]')) return; // Don't navigate if clicking Add to Bag
        const id = card.dataset.id;
        window.shopApp.detail.show(id);
      });
    });

    // Bind quick-add buttons
    shAll('[data-add]', this.grid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.shopApp.cart.add(btn.dataset.add);
      });
    });
  }

  bindFilterBtns() {
    if (!this.filtersWrap) return;
    shAll('.sh-filter-btn', this.filtersWrap).forEach(btn => {
      btn.addEventListener('click', () => {
        this.active = btn.dataset.filter;
        shAll('.sh-filter-btn', this.filtersWrap).forEach(b => b.classList.remove('sh-filter-active'));
        btn.classList.add('sh-filter-active');
        this.apply();
      });
    });
  }

  bindNavFilters() {
    shAll('[data-sh-filter]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const f = link.dataset.shFilter;
        this.active = f;
        // Update filter buttons
        if (this.filtersWrap) {
          shAll('.sh-filter-btn', this.filtersWrap).forEach(b => {
            b.classList.toggle('sh-filter-active', b.dataset.filter === f);
          });
        }
        this.apply();
        // Make sure we're on grid view
        window.shopApp.detail.hide();
        // Scroll to products
        const sec = sh('#products');
        if (sec) setTimeout(() => window.scrollTo({ top: sec.offsetTop - 60, behavior: 'smooth' }), 50);
      });
    });
  }

  apply() {
    this.reveal.seen.clear();
    const filtered = this.active === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === this.active);
    this.render(filtered);
  }
}

// ─── CART ──────────────────────────────────────────────────────
class ShCart {
  constructor() {
    this.items = []; // { id, qty }
    this.drawer = sh('#shCartDrawer');
    this.overlay = sh('#shCartOverlay');
    this.body = sh('#shCartBody');
    this.foot = sh('#shCartFoot');
    this.totalEl = sh('#shCartTotal');
    this.countEl = sh('#shCartCount');
    this.toggleBtn = sh('#shCartToggle');
    this.closeBtn = sh('#shCartClose');
    this.checkoutBtn = sh('#shCheckoutBtn');
  }

  init() {
    try { const s = sessionStorage.getItem('sh_cart'); if (s) this.items = JSON.parse(s); } catch (e) {}

    this.toggleBtn?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());
    this.checkoutBtn?.addEventListener('click', () => this.checkout());
    this.updateUI();
  }

  add(id) {
    const ex = this.items.find(i => i.id === id);
    if (ex) ex.qty++; else this.items.push({ id, qty: 1 });
    this.save(); this.updateUI(); this.toast(id); this.open();
  }

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save(); this.updateUI();
  }

  save() { try { sessionStorage.setItem('sh_cart', JSON.stringify(this.items)); } catch (e) {} }

  getTotal() { return this.items.reduce((s, i) => { const p = PRODUCTS.find(x => x.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0); }
  getCount() { return this.items.reduce((s, i) => s + i.qty, 0); }

  updateUI() {
    const count = this.getCount();
    const total = this.getTotal();

    if (this.countEl) {
      this.countEl.textContent = count;
      this.countEl.classList.toggle('sh-count-show', count > 0);
    }

    if (this.body) {
      if (!this.items.length) {
        this.body.innerHTML = '<div class="sh-cart-empty"><i class="fas fa-bag-shopping"></i><p>Your bag is empty.</p></div>';
        if (this.foot) this.foot.style.display = 'none';
      } else {
        this.body.innerHTML = this.items.map(item => {
          const p = PRODUCTS.find(x => x.id === item.id);
          if (!p) return '';
          return `
            <div class="sh-cart-item">
              <div class="sh-cart-item-img"><img src="${p.image}" alt="${p.name}"></div>
              <div class="sh-cart-item-info">
                <div class="sh-cart-item-name">${p.name}</div>
                <div class="sh-cart-item-variant">${p.storage ? p.storage + ' · ' : ''}${p.color} · Qty: ${item.qty}</div>
                <div class="sh-cart-item-price">$${(p.price * item.qty).toLocaleString()}</div>
              </div>
              <button class="sh-cart-item-remove" data-remove="${p.id}"><i class="fas fa-trash-can"></i></button>
            </div>`;
        }).join('');
        if (this.foot) this.foot.style.display = 'block';

        // Bind remove buttons
        shAll('[data-remove]', this.body).forEach(btn => {
          btn.addEventListener('click', () => this.remove(btn.dataset.remove));
        });
      }
    }
    if (this.totalEl) this.totalEl.textContent = `$${total.toLocaleString()}`;
  }

  open() {
    this.drawer?.classList.add('sh-open');
    this.overlay?.classList.add('sh-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.drawer?.classList.remove('sh-open');
    this.overlay?.classList.remove('sh-open');
    document.body.style.overflow = '';
  }

  checkout() {
    alert('Square checkout integration coming soon!\n\nFor now, call or text (929) 417-6819 to complete your order.');
  }

  toast(id) {
    const p = PRODUCTS.find(x => x.id === id);
    const toast = sh('#shToast');
    const msg = sh('#shToastMsg');
    if (!toast || !msg || !p) return;
    msg.textContent = `${p.name} added to bag!`;
    toast.classList.add('sh-toast-show');
    setTimeout(() => toast.classList.remove('sh-toast-show'), 2500);
  }
}

// ─── PRODUCT DETAIL VIEW ──────────────────────────────────────
// Swaps the #shopMain content to show a single product,
// and restores the grid view when "back" is clicked.
class ShProductDetail {
  constructor() {
    this.main = sh('#shopMain');
    this.gridHTML = ''; // Cached grid HTML
  }

  init() {
    // Check URL hash for product ID on load: #product/iphone-16-pro-256
    const hash = window.location.hash;
    if (hash.startsWith('#product/')) {
      const id = hash.replace('#product/', '');
      // Small delay so grid renders first (needed for cache)
      setTimeout(() => this.show(id), 200);
    }

    // Handle browser back
    window.addEventListener('hashchange', () => {
      const h = window.location.hash;
      if (h.startsWith('#product/')) {
        this.show(h.replace('#product/', ''));
      } else if (!h || h === '#' || h === '#products') {
        this.hide();
      }
    });
  }

  show(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product || !this.main) return;

    // Cache grid view
    if (!this.gridHTML) this.gridHTML = this.main.innerHTML;

    // Update URL hash
    window.location.hash = `product/${id}`;

    const savePct = Math.round(((product.retail - product.price) / product.retail) * 100);
    const bmSave = product.backMarket - product.price;
    const condCls = product.condition === 'excellent' ? 'sh-cond-excellent' : product.condition === 'good' ? 'sh-cond-good' : 'sh-cond-fair';
    const condTxt = product.condition.charAt(0).toUpperCase() + product.condition.slice(1);
    const specLabels = ['Processor', 'Storage', 'Camera / Display'];

    this.main.innerHTML = `
      <div class="sp-view">
        <div class="container">
          <button class="sp-back" id="spBack"><i class="fas fa-arrow-left"></i> Back to Shop</button>
          <div class="sp-layout">
            <div class="sp-gallery">
              <div class="sp-gallery-main">
                <img src="${product.image}" alt="${product.name} ${product.storage} ${product.color}">
              </div>
            </div>
            <div class="sp-info">
              <span class="sp-cond-tag ${condCls}">${condTxt} Condition</span>
              <h1>${product.name}</h1>
              <p class="sp-info-sub">${product.storage ? product.storage + ' · ' : ''}${product.color} · Refurbished</p>
              <div class="sp-price-row">
                <span class="sp-price">$${product.price}</span>
                <span class="sp-price-orig">$${product.retail}</span>
                <span class="sp-price-save">Save ${savePct}%</span>
              </div>
              <div class="sp-compare-line">
                <i class="fas fa-scale-balanced"></i>
                <span>Back Market: <strong>$${product.backMarket}</strong></span>
                <span>→ You save <span class="sp-compare-diff">$${bmSave} more</span> with us</span>
              </div>
              <div class="sp-divider"></div>
              <div class="sp-specs">
                ${product.specs.map((s, i) => `
                  <div class="sp-spec">
                    <div class="sp-spec-label">${specLabels[i] || 'Feature'}</div>
                    <div class="sp-spec-value">${s}</div>
                  </div>`).join('')}
                <div class="sp-spec">
                  <div class="sp-spec-label">Condition</div>
                  <div class="sp-spec-value">${condTxt}</div>
                </div>
              </div>
              <div class="sp-ctas">
                <button class="sp-cta-main" id="spAddBtn"><i class="fas fa-bag-shopping"></i> Add to Bag — $${product.price}</button>
                <a href="tel:+19294176819" class="sp-cta-call"><i class="fas fa-phone"></i> Questions? Call (929) 417-6819</a>
              </div>
              <div class="sp-divider"></div>
              <div class="sp-trust-list">
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

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update page title
    document.title = `${product.name} ${product.storage || ''} — Refurbished | ETW Shop`;

    // Bind back button
    sh('#spBack')?.addEventListener('click', () => this.hide());

    // Bind add to bag
    sh('#spAddBtn')?.addEventListener('click', () => window.shopApp.cart.add(product.id));
  }

  hide() {
    if (!this.main || !this.gridHTML) return;
    this.main.innerHTML = this.gridHTML;
    this.gridHTML = '';

    // Reset hash
    history.pushState(null, '', window.location.pathname);

    // Reset title
    document.title = 'Shop Refurbished Apple — iPhones, MacBooks, iPads | ETW Shop';

    // Re-init grid, reveals, badges, filters
    window.shopApp.reveal.observe(shAll('[data-sh-reveal]'));
    window.shopApp.products.init();
    window.shopApp.badges.init();
  }
}

// ─── PRICE COMPARISON TABLE ──────────────────────────────────
class ShCompare {
  init() {
    const tbody = sh('#shCompareTable tbody');
    if (!tbody) return;
    const ids = ['iphone-16-pro-256', 'iphone-15-pro-max-256', 'macbook-air-m3-256', 'ipad-air-m2-128', 'airpods-pro-2'];
    const products = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    tbody.innerHTML = products.map(p => {
      const diff = p.backMarket - p.price;
      return `<tr>
        <td><strong>${p.name}</strong> ${p.storage}</td>
        <td>$${p.backMarket}</td>
        <td>$${p.price} <span class="sh-compare-badge">−$${diff}</span></td>
      </tr>`;
    }).join('');
  }
}

// ─── SMOOTH SCROLL ────────────────────────────────────────────
class ShSmoothScroll {
  init() {
    shAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href.startsWith('#product/')) return;
        const t = sh(href);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
      });
    });
  }
}

// ─── APPLICATION ──────────────────────────────────────────────
class ShopApp {
  constructor() {
    this.reveal   = new ShReveal();
    this.progress = new ShProgress();
    this.badges   = new ShHeroBadges();
    this.products = new ShProductGrid(this.reveal);
    this.cart     = new ShCart();
    this.detail   = new ShProductDetail();
    this.compare  = new ShCompare();
    this.smooth   = new ShSmoothScroll();
  }

  init() {
    const mods = [
      this.reveal, this.progress, this.badges,
      this.products, this.cart, this.detail,
      this.compare, this.smooth
    ];
    mods.forEach(m => {
      try { m.init(); }
      catch (err) { console.error('[Shop]', err); }
    });
    console.log('✦ ETW Shop — Premium Edition loaded');
  }
}

// ─── INIT ─────────────────────────────────────────────────────
let shopApp;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { shopApp = new ShopApp(); shopApp.init(); window.shopApp = shopApp; });
} else {
  shopApp = new ShopApp(); shopApp.init(); window.shopApp = shopApp;
}
