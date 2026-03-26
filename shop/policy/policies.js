/**
 * ═══════════════════════════════════════════════════════════════
 *  ETW SHOP — Policy Pages Shared JS
 *  File: shop/policies.js
 *  Header scroll, mobile menu, smooth scroll, back to top
 * ═══════════════════════════════════════════════════════════════
 */

(function(){
  var Q = function(s){ return document.querySelector(s); };
  var QA = function(s){ return [].slice.call(document.querySelectorAll(s)); };

  // Header scroll
  var header = Q('#shHeader');
  if(header){
    var last = 0;
    window.addEventListener('scroll', function(){
      var now = Date.now();
      if(now - last < 80) return;
      last = now;
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // Mobile menu
  var menuBtn = Q('#shMenuBtn');
  var mob = Q('#shMob');
  var overlay = Q('.sh-mob-overlay');
  if(menuBtn && mob){
    function toggleMenu(){
      menuBtn.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    }
    function closeMenu(){
      menuBtn.classList.remove('open');
      mob.classList.remove('open');
      document.body.style.overflow = '';
    }
    menuBtn.addEventListener('click', toggleMenu);
    if(overlay) overlay.addEventListener('click', closeMenu);
    QA('.sh-mob-panel a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  }

  // Smooth scroll
  document.addEventListener('click', function(e){
    var link = e.target.closest('a[href^="#"]');
    if(!link) return;
    var href = link.getAttribute('href');
    if(href === '#') return;
    var t = Q(href);
    if(t){ e.preventDefault(); window.scrollTo({top: t.offsetTop - 60, behavior: 'smooth'}); }
  });

  // Back to top
  var topBtn = Q('#shTop');
  if(topBtn){
    window.addEventListener('scroll', function(){
      topBtn.classList.toggle('vis', window.scrollY > 400);
    });
    topBtn.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }
})();
