/**
 * ═══════════════════════════════════════════════════════════════
 *  ETW SHOP V4 — Multi-JSON · Gallery · Variants · Colors · Stock
 *  File: shop/script.js
 * ═══════════════════════════════════════════════════════════════
 */
var Q=function(s,p){return(p||document).querySelector(s)};
var QA=function(s,p){return[].slice.call((p||document).querySelectorAll(s))};
var throttle=function(fn,ms){var l=0;return function(){var n=Date.now();if(n-l>=ms){l=n;fn.apply(null,arguments)}}};

var CHECKOUT_API="https://www.elanstechworld.com/api/create-checkout";
var P=[];
var activeFilter="all";
var isDetailView=false;
var gridSnapshot=null;
var selectedShipping="standard";
var cartItems=[];
try{var sc=sessionStorage.getItem("sh_cart");if(sc)cartItems=JSON.parse(sc)}catch(e){}
var SHIPPING={
  standard:{label:"Standard Shipping (3-5 days)",price:9.99},
  nyc:{label:"NYC Same-Day Delivery",price:79}
};

/* ═══ LOAD ALL JSON FILES (skips missing) ═══ */
function loadProducts(cb){
  var files=["json/iphone.json","json/macbooks.json","json/ipads.json","json/watches.json","json/airpods.json"];
  Promise.all(files.map(function(f){
    return fetch(f).then(function(r){
      if(!r.ok)return[];
      return r.json();
    }).catch(function(){return[]});
  })).then(function(results){
    P=[];
    results.forEach(function(arr){if(Array.isArray(arr))P=P.concat(arr)});
    if(P.length)cb();
    else{
      var g=Q("#shGrid");
      if(g)g.innerHTML='<div class="sh-empty"><i class="fas fa-exclamation-triangle"></i><p>No products available. Please refresh.</p></div>';
    }
  });
}

/* ═══ HELPERS ═══ */
function lowestPrice(p){var m=Infinity;p.variants.forEach(function(v){if(v.price<m)m=v.price});return m}
function highestRetail(p){var m=0;p.variants.forEach(function(v){if(v.retail>m)m=v.retail});return m}
function anyStock(p){return p.variants.some(function(v){return v.inStock})}
function cc(c){return c==="excellent"?"sh-cond-excellent":c==="good"?"sh-cond-good":"sh-cond-fair"}
function cl(c){return c.charAt(0).toUpperCase()+c.slice(1)}

/* ═══ REVEAL ═══ */
var revealSeen=new Set();
function reveal(els){
  if(!els||!els.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting&&!revealSeen.has(e.target)){
        revealSeen.add(e.target);
        var d=parseInt(e.target.dataset.d||0);
        setTimeout(function(){e.target.classList.add("vis")},d);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.08,rootMargin:"0px 0px -30px 0px"});
  els.forEach(function(el){obs.observe(el)});
}
function initReveal(){reveal(QA("[data-sh]"))}

/* ═══ PROGRESS ═══ */
function initProgress(){
  var bar=Q("#shProgress");if(!bar)return;
  window.addEventListener("scroll",throttle(function(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.transform="scaleX("+(h>0?window.scrollY/h:0)+")";
  },30));
}

/* ═══ HEADER ═══ */
function initHeader(){
  var h=Q("#shHeader");if(!h)return;
  window.addEventListener("scroll",throttle(function(){
    h.classList.toggle("scrolled",window.scrollY>40);
  },80));
}

/* ═══ MOBILE MENU ═══ */
function initMobile(){
  var btn=Q("#shMenuBtn"),mob=Q("#shMob"),ov=Q(".sh-mob-overlay");
  if(!btn||!mob)return;
  function toggle(){btn.classList.toggle("open");mob.classList.toggle("open");document.body.style.overflow=mob.classList.contains("open")?"hidden":""}
  function close(){btn.classList.remove("open");mob.classList.remove("open");document.body.style.overflow=""}
  btn.addEventListener("click",toggle);
  if(ov)ov.addEventListener("click",close);
  QA("a",mob).forEach(function(a){a.addEventListener("click",close)});
}

/* ═══ CURSOR GLOW ═══ */
function initGlow(){
  if(window.innerWidth<768)return;
  var g=Q("#shGlow");if(!g)return;
  var mx=0,my=0,cx=0,cy=0,on=false;
  document.addEventListener("mousemove",function(e){mx=e.clientX;my=e.clientY});
  document.addEventListener("mouseenter",function(){on=true;g.classList.add("on")});
  document.addEventListener("mouseleave",function(){on=false;g.classList.remove("on")});
  (function lp(){
    if(on){cx+=(mx-cx)*.08;cy+=(my-cy)*.08;g.style.left=cx+"px";g.style.top=cy+"px"}
    requestAnimationFrame(lp);
  })();
}

/* ═══ PARTICLES ═══ */
function initParticles(){
  var c=Q("#shParticles");if(!c||c.children.length>0)return;
  var n=window.innerWidth<768?12:30;
  var cols=["rgba(0,113,227,.4)","rgba(90,200,250,.3)","rgba(191,90,242,.3)","rgba(52,199,89,.25)","rgba(191,162,106,.2)"];
  for(var i=0;i<n;i++){
    var el=document.createElement("div");
    el.className="sh-particle";
    var x=Math.random()*100,y=30+Math.random()*70,sz=1.5+Math.random()*3,
        dur=10+Math.random()*16,delay=Math.random()*dur,
        dx=-80+Math.random()*160,dy=-(100+Math.random()*300),pk=.08+Math.random()*.3;
    el.style.cssText="left:"+x+"%;top:"+y+"%;width:"+sz+"px;height:"+sz+"px;background:"+cols[i%cols.length]+";--dur:"+dur+"s;--delay:-"+delay+"s;--dx:"+dx+"px;--dy:"+dy+"px;--peak:"+pk;
    c.appendChild(el);
  }
}

/* ═══ FLOATING BADGES ═══ */
function initBadges(){
  QA(".sh-fbadge").forEach(function(b,i){
    if(!b.classList.contains("show"))setTimeout(function(){b.classList.add("show")},900+i*350);
  });
}

/* ═══ HERO VIDEO ═══ */
function initHeroVideo(){
  var vid=Q(".sh-hero-video");if(!vid)return;
  vid.muted=true;vid.playsInline=true;
  vid.setAttribute("playsinline","");vid.setAttribute("muted","");
  vid.load();
  var p=vid.play();
  if(p!==undefined)p.catch(function(){
    var evts=["touchstart","click","scroll"];
    function once(){vid.play().catch(function(){});evts.forEach(function(e){document.removeEventListener(e,once)})}
    evts.forEach(function(e){document.addEventListener(e,once,{once:true,passive:true})});
  });
  document.addEventListener("visibilitychange",function(){if(!document.hidden&&vid.paused)vid.play().catch(function(){})});
  window.addEventListener("focus",function(){if(vid.paused)vid.play().catch(function(){})});
}

/* ═══ HERO PARALLAX ═══ */
var heroRAF=null;
function initHeroParallax(){
  var fl=Q("#shHeroFloat"),hero=Q("#shHero");
  if(!fl||!hero||window.innerWidth<768)return;
  var mx=.5,my=.5,cx=.5,cy=.5;
  hero.addEventListener("mousemove",function(e){var r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height});
  hero.addEventListener("mouseleave",function(){mx=.5;my=.5});
  if(heroRAF)cancelAnimationFrame(heroRAF);
  (function lp(){
    cx+=(mx-cx)*.04;cy+=(my-cy)*.04;
    var ry=(cx-.5)*12,rx=(cy-.5)*-8;
    fl.style.transform="translateY("+Math.sin(Date.now()/1000)*10+"px) rotateX("+rx+"deg) rotateY("+ry+"deg)";
    heroRAF=requestAnimationFrame(lp);
  })();
}

/* ═══ CARD TILT ═══ */
function bindCardTilt(){
  if(window.innerWidth<768)return;
  QA(".sh-card").forEach(function(card){
    card.addEventListener("mousemove",function(e){
      var r=card.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5;
      var y=(e.clientY-r.top)/r.height-.5;
      card.style.transform="perspective(800px) rotateX("+y*-8+"deg) rotateY("+x*8+"deg) translateY(-6px)";
      var glow=Q(".sh-card-glow",card);
      if(glow){glow.style.setProperty("--mx",(e.clientX-r.left)+"px");glow.style.setProperty("--my",(e.clientY-r.top)+"px")}
    });
    card.addEventListener("mouseleave",function(){
      card.style.transition="transform .5s cubic-bezier(.25,.46,.45,.94)";
      card.style.transform="perspective(800px) rotateX(0) rotateY(0) translateY(0)";
      setTimeout(function(){card.style.transition=""},500);
    });
  });
}

/* ═══ MAGNETIC BUTTONS ═══ */
function initMagnetic(){
  if(window.innerWidth<768)return;
  QA(".btn-primary,.btn-dark").forEach(function(btn){
    btn.addEventListener("mousemove",function(e){
      var r=btn.getBoundingClientRect();
      btn.style.transform="translate("+(e.clientX-r.left-r.width/2)*.25+"px,"+(e.clientY-r.top-r.height/2)*.25+"px)";
    });
    btn.addEventListener("mouseleave",function(){
      btn.style.transition="transform .4s cubic-bezier(.34,1.56,.64,1)";
      btn.style.transform="translate(0,0)";
      setTimeout(function(){btn.style.transition=""},400);
    });
  });
}

/* ═══════════════════════════════════════
   PRODUCT GRID
═══════════════════════════════════════ */
function renderGrid(products){
  var grid=Q("#shGrid");if(!grid)return;
  if(!products.length){
    grid.innerHTML='<div class="sh-empty"><i class="fas fa-search"></i><p>No products found.</p></div>';
    return;
  }
  var html="";
  products.forEach(function(p,i){
    var low=lowestPrice(p),high=highestRetail(p),pct=Math.round(((high-low)/high)*100);
    var stock=anyStock(p),multiVar=p.variants.length>1;
    html+='<div class="sh-card'+(stock?'':' sh-card-oos')+'" data-sh="up" data-d="'+Math.min(i*50,250)+'" data-id="'+p.id+'">'
      +'<div class="sh-card-glow"></div>'
      +'<span class="sh-cond '+cc(p.cond)+'">'+cl(p.cond)+'</span>'
      +(pct>=25?'<span class="sh-save">-'+pct+'%</span>':'')
      +(stock?'':'<span class="sh-oos-badge">Out of Stock</span>')
      +'<div class="sh-card-img">'
      +'<img src="'+p.thumb+'" alt="'+p.name+'" loading="lazy">'
      +(stock?'<div class="sh-card-quick"><button class="sh-qbtn" data-add="'+p.id+'"><i class="fas fa-bag-shopping"></i> Add to Bag</button></div>':'')
      +'</div>'
      +'<div class="sh-card-info">'
      +'<div class="sh-card-cat">'+p.cat+'</div>'
      +'<h3 class="sh-card-name">'+p.name+'</h3>'
      +'<div class="sh-card-specs">'+p.specs.map(function(s){return'<span class="sh-card-spec">'+s+'</span>'}).join("")+'</div>'
      +'<div class="sh-card-prices">'
      +(multiVar?'<span class="sh-card-from">from</span>':'')
      +'<span class="sh-card-price">$'+low+'</span>'
      +'<span class="sh-card-orig">$'+high+'</span>'
      +'<span class="sh-card-saved">Save $'+(high-low)+'</span>'
      +'</div>'
      +'</div></div>';
  });
  grid.innerHTML=html;
  revealSeen.clear();reveal(QA("[data-sh]",grid));
  QA(".sh-card",grid).forEach(function(card){
    card.addEventListener("click",function(e){
      if(e.target.closest("[data-add]"))return;
      showProduct(card.dataset.id);
    });
  });
  QA("[data-add]",grid).forEach(function(btn){
    btn.addEventListener("click",function(e){
      e.stopPropagation();
      var p=findProduct(btn.dataset.add);
      if(p){var v=p.variants.find(function(x){return x.inStock});if(v)cartAdd(p.id,v.storage)}
    });
  });
  bindCardTilt();
}

function applyFilter(){
  var f=activeFilter==="all"?P:P.filter(function(p){return p.cat===activeFilter});
  renderGrid(f);
}

function initFilters(){
  var wrap=Q("#shFilters");if(!wrap)return;
  QA(".sh-fbtn",wrap).forEach(function(btn){
    btn.addEventListener("click",function(){
      activeFilter=btn.dataset.filter;
      QA(".sh-fbtn",wrap).forEach(function(b){b.classList.toggle("active",b===btn)});
      applyFilter();
    });
  });
  QA("[data-f]").forEach(function(link){
    link.addEventListener("click",function(e){
      e.preventDefault();
      activeFilter=link.dataset.f;
      var w=Q("#shFilters");
      if(w)QA(".sh-fbtn",w).forEach(function(b){b.classList.toggle("active",b.dataset.filter===activeFilter)});
      if(isDetailView)hideProduct();
      applyFilter();
      var sec=Q("#products");
      if(sec)setTimeout(function(){window.scrollTo({top:sec.offsetTop-60,behavior:"smooth"})},100);
    });
  });
}

function findProduct(id){return P.find(function(x){return x.id===id})}

/* ═══════════════════════════════════════
   PRODUCT DETAIL — Gallery + Variants + Color Swatches
═══════════════════════════════════════ */
function showProduct(id){
  var p=findProduct(id);if(!p)return;
  var view=Q("#shopView");if(!view)return;
  if(!gridSnapshot)gridSnapshot=view.innerHTML;
  isDetailView=true;
  history.pushState({product:id},"","#product/"+id);

  var v=p.variants[0];
  var activeColorIdx=0;

  function buildDetail(selVar){
    var sv=selVar||v;
    var pct=Math.round(((sv.retail-sv.price)/sv.retail)*100);
    var bmDiff=sv.bm-sv.price;

    // Use per-color single image when colorOptions exist, else full images array
    var activeImgs=(p.colorOptions&&p.colorOptions[activeColorIdx])
      ?[p.colorOptions[activeColorIdx].img]
      :p.images;

    /* ── Gallery ── */
    var galHtml='<div class="sp-gallery-wrap">'
      +'<div class="sp-gallery-main" id="spMainImg">';
    if(activeImgs.length>1)galHtml+='<button class="sp-arrow sp-arrow-l" id="spPrev"><i class="fas fa-chevron-left"></i></button>';
    galHtml+='<img src="'+activeImgs[0]+'" alt="'+p.name+'" id="spImg">';
    if(activeImgs.length>1)galHtml+='<button class="sp-arrow sp-arrow-r" id="spNext"><i class="fas fa-chevron-right"></i></button>';
    if(activeImgs.length>1)galHtml+='<div class="sp-img-count" id="spCount">1 / '+activeImgs.length+'</div>';
    galHtml+='</div>';
    if(activeImgs.length>1){
      galHtml+='<div class="sp-thumbs" id="spThumbs">';
      activeImgs.forEach(function(img,i){
        galHtml+='<button class="sp-thumb'+(i===0?' sp-thumb-active':'')+'" data-i="'+i+'"><img src="'+img+'" alt="View '+(i+1)+'"></button>';
      });
      galHtml+='</div>';
    }
    galHtml+='</div>';

    /* ── Color Swatches ── */
    var colorHtml='';
    if(p.colorOptions&&p.colorOptions.length>1){
      var activeColorName=p.colorOptions[activeColorIdx].name;
      colorHtml='<div class="sp-colors" id="spColors">'
        +'<div class="sp-color-label">Color: <span class="sp-color-name-display" id="spColorName">'+activeColorName+'</span></div>'
        +'<div class="sp-color-btns">';
      p.colorOptions.forEach(function(co,ci){
        var hex=co.swatch.replace('#','');
        var r=parseInt(hex.substr(0,2),16),g=parseInt(hex.substr(2,2),16),b=parseInt(hex.substr(4,2),16);
        var lum=(r*299+g*587+b*114)/1000;
        var lightClass=lum>200?' sp-color-light':'';
        var selClass=ci===activeColorIdx?' sp-color-sel':'';
        colorHtml+='<button class="sp-color-btn'+lightClass+selClass+'" data-ci="'+ci+'" style="background:'+co.swatch+'" title="'+co.name+'"></button>';
      });
      colorHtml+='</div></div>';
    }

    /* ── Storage Variants ── */
    var varHtml='';
    if(p.variants.length>1&&p.variants[0].storage){
      varHtml='<div class="sp-variants" id="spVariants">'
        +'<div class="sp-var-label">Storage</div>'
        +'<div class="sp-var-btns">';
      p.variants.forEach(function(vr){
        if(!vr.storage)return;
        var sel=vr.storage===sv.storage,oos=!vr.inStock;
        varHtml+='<button class="sp-var-btn'+(sel?' sp-var-sel':'')+(oos?' sp-var-oos':'')+'" data-stor="'+vr.storage+'"'+(oos?' disabled':'')+'>'
          +vr.storage+(oos?'<span class="sp-var-oos-tag">Sold out</span>':'')+'</button>';
      });
      varHtml+='</div></div>';
    }

    /* ── Full HTML ── */
    var activeColorLabel=(p.colorOptions?p.colorOptions[activeColorIdx].name:sv.color);
    var html='<div class="sp-wrap"><div class="container">'
      +'<button class="sp-back" id="spBack"><i class="fas fa-arrow-left"></i> Back to Shop</button>'
      +'<div class="sp-layout">'
      +'<div class="sp-gallery">'+galHtml+'</div>'
      +'<div class="sp-info sp-info-animate" id="spInfo">'
      +'<span class="sp-cond-tag '+cc(p.cond)+'">'+cl(p.cond)+' Condition</span>'
      +'<h1>'+p.name+'</h1>'
      +'<p class="sp-sub">'+activeColorLabel+' &middot; Refurbished</p>'
      +'<div class="sp-price-row">'
      +'<span class="sp-price" id="spPrice">$'+sv.price+'</span>'
      +'<span class="sp-orig" id="spOrig">$'+sv.retail+'</span>'
      +'<span class="sp-save-tag" id="spSave">Save '+pct+'%</span>'
      +'</div>'
      +'<div class="sp-cmp">'
      +'<i class="fas fa-scale-balanced"></i>'
      +'<span>Back Market: <strong id="spBm">$'+sv.bm+'</strong></span>'
      +'<span>&rarr; You save <span class="sp-cmp-diff" id="spBmDiff">$'+bmDiff+' more</span> with us</span>'
      +'</div>'
      +colorHtml
      +varHtml
      +'<div class="sp-div"></div>'
      +'<div class="sp-specs">';

    var labels=["Processor","Camera","Material"];
    p.specs.forEach(function(s,i){
      html+='<div class="sp-spec"><div class="sp-spec-l">'+(labels[i]||"Feature")+'</div><div class="sp-spec-v">'+s+'</div></div>';
    });
    html+='<div class="sp-spec"><div class="sp-spec-l">Condition</div><div class="sp-spec-v">'+cl(p.cond)+'</div></div>'
      +'</div>'
      +'<div class="sp-ctas">';

    if(sv.inStock){
      html+='<button class="sp-cta-main" id="spAdd"><i class="fas fa-bag-shopping"></i> Add to Bag &mdash; $'+sv.price+'</button>';
    }else{
      html+='<button class="sp-cta-main sp-cta-oos" disabled><i class="fas fa-bell"></i> Out of Stock</button>';
    }

    html+='<a href="tel:+19294176819" class="sp-cta-call"><i class="fas fa-phone"></i> Questions? (929) 417-6819</a>'
      +'</div>'
      +'<div class="sp-div"></div>'
      +'<div class="sp-trust">'
      +'<div class="sp-trust-row"><i class="fas fa-check-circle"></i> 90-day warranty included</div>'
      +'<div class="sp-trust-row"><i class="fas fa-check-circle"></i> 44-point inspection certified</div>'
      +'<div class="sp-trust-row"><i class="fas fa-check-circle"></i> Works like new or send it back</div>'
      +'<div class="sp-trust-row"><i class="fas fa-check-circle"></i> 14-day free returns</div>'
      +'<div class="sp-trust-row"><i class="fas fa-check-circle"></i> Secure Square checkout</div>'
      +'</div>'
      +'</div>' // sp-info
      +'</div>' // sp-layout
      +'</div></div>'; // container, sp-wrap
    return html;
  }

  function bindDetail(){
    var imgIdx=0;
    var currentImgs=(p.colorOptions&&p.colorOptions[activeColorIdx])
      ?[p.colorOptions[activeColorIdx].img]
      :p.images;

    function updateImg(idx){
      imgIdx=idx;
      var img=Q("#spImg");if(img)img.src=currentImgs[imgIdx];
      var cnt=Q("#spCount");if(cnt)cnt.textContent=(imgIdx+1)+" / "+currentImgs.length;
      QA(".sp-thumb").forEach(function(t,i){t.classList.toggle("sp-thumb-active",i===imgIdx)});
    }

    var prev=Q("#spPrev"),next=Q("#spNext");
    if(prev)prev.addEventListener("click",function(){updateImg((imgIdx-1+currentImgs.length)%currentImgs.length)});
    if(next)next.addEventListener("click",function(){updateImg((imgIdx+1)%currentImgs.length)});
    QA(".sp-thumb").forEach(function(t){
      t.addEventListener("click",function(){updateImg(parseInt(t.dataset.i))});
    });

    // Touch swipe on gallery
    var mainImg=Q("#spMainImg");
    if(mainImg){
      var startX=0;
      mainImg.addEventListener("touchstart",function(e){startX=e.touches[0].clientX},{passive:true});
      mainImg.addEventListener("touchend",function(e){
        var diff=startX-e.changedTouches[0].clientX;
        if(Math.abs(diff)>40){
          if(diff>0)updateImg((imgIdx+1)%currentImgs.length);
          else updateImg((imgIdx-1+currentImgs.length)%currentImgs.length);
        }
      });
    }

    // Color swatch clicks
    QA(".sp-color-btn").forEach(function(btn){
      btn.addEventListener("click",function(){
        activeColorIdx=parseInt(btn.dataset.ci);
        var co=p.colorOptions[activeColorIdx];
        // swap gallery image
        var imgEl=Q("#spImg");if(imgEl){imgEl.style.opacity="0";setTimeout(function(){imgEl.src=co.img;imgEl.style.opacity="1"},150)}
        // highlight active swatch
        QA(".sp-color-btn").forEach(function(b){b.classList.toggle("sp-color-sel",b===btn)});
        // update labels
        var nameEl=Q("#spColorName");if(nameEl)nameEl.textContent=co.name;
        var subEl=Q(".sp-sub");if(subEl)subEl.textContent=co.name+" \u00B7 Refurbished";
      });
    });

    // Storage variant clicks
    QA(".sp-var-btn").forEach(function(btn){
      btn.addEventListener("click",function(){
        var stor=btn.dataset.stor;
        var nv=p.variants.find(function(x){return x.storage===stor});
        if(!nv)return;
        v=nv;
        var pct=Math.round(((nv.retail-nv.price)/nv.retail)*100);
        var el;
        el=Q("#spPrice");if(el)el.textContent="$"+nv.price;
        el=Q("#spOrig");if(el)el.textContent="$"+nv.retail;
        el=Q("#spSave");if(el)el.textContent="Save "+pct+"%";
        el=Q("#spBm");if(el)el.textContent="$"+nv.bm;
        el=Q("#spBmDiff");if(el)el.textContent="$"+(nv.bm-nv.price)+" more";
        QA(".sp-var-btn").forEach(function(b){b.classList.toggle("sp-var-sel",b.dataset.stor===stor)});
        var addBtn=Q("#spAdd");
        if(addBtn){
          if(nv.inStock){
            addBtn.disabled=false;
            addBtn.className="sp-cta-main";
            addBtn.innerHTML='<i class="fas fa-bag-shopping"></i> Add to Bag &mdash; $'+nv.price;
          }else{
            addBtn.disabled=true;
            addBtn.className="sp-cta-main sp-cta-oos";
            addBtn.innerHTML='<i class="fas fa-bell"></i> Out of Stock';
          }
        }
      });
    });

    // Back button
    var backBtn=Q("#spBack");
    if(backBtn)backBtn.addEventListener("click",function(){hideProduct()});

    // Add to bag
    var addBtn=Q("#spAdd");
    if(addBtn)addBtn.addEventListener("click",function(){cartAdd(p.id,v.storage)});

    // Add subtle fade transition to gallery image on src change
    var spImg=Q("#spImg");
    if(spImg){spImg.style.transition="opacity .15s ease"}
  }

  view.innerHTML=buildDetail(v);
  window.scrollTo({top:0,behavior:"smooth"});
  document.title=p.name+" - ETW Shop";
  bindDetail();
}

function hideProduct(){
  var view=Q("#shopView");if(!view||!gridSnapshot)return;
  view.innerHTML=gridSnapshot;gridSnapshot=null;isDetailView=false;
  history.pushState(null,"",window.location.pathname);
  document.title="Shop Refurbished Apple | ETW Shop";
  revealSeen.clear();reveal(QA("[data-sh]"));
  initFilters();applyFilter();initBadges();initHeroVideo();initParticles();initHeroParallax();initMagnetic();
}

window.addEventListener("popstate",function(e){
  if(e.state&&e.state.product)showProduct(e.state.product);
  else if(isDetailView)hideProduct();
});

function checkHash(){
  var h=window.location.hash;
  if(h.indexOf("#product/")===0)setTimeout(function(){showProduct(h.replace("#product/",""))},400);
}

/* ═══════════════════════════════════════
   COMPARISON TABLE
═══════════════════════════════════════ */
function initCompare(){
  var tbody=Q("#shCmp tbody");if(!tbody)return;
  var ids=["iphone-16-pro","iphone-15-pro-max","iphone-14-pro-max","macbook-air-m3","ipad-air-m2","airpods-pro-2"];
  var html="";
  ids.forEach(function(id){
    var p=findProduct(id);if(!p)return;
    var v=p.variants[0];
    html+='<tr data-sh="up" data-d="0">'
      +'<td><strong>'+p.name+'</strong> '+v.storage+'</td>'
      +'<td class="sh-cmp-bm">$'+v.bm+'</td>'
      +'<td class="sh-cmp-us">$'+v.price+' <span class="sh-cmp-save">&minus;$'+(v.bm-v.price)+'</span></td>'
      +'</tr>';
  });
  tbody.innerHTML=html;
  reveal(QA("[data-sh]",tbody));
}

/* ═══════════════════════════════════════
   BATTERY COUNTER
═══════════════════════════════════════ */
function initBatteryCounter(){
  var el=Q(".sq-battery-num");if(!el)return;
  var target=parseInt(el.dataset.target)||90,done=false;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting&&!done){
        done=true;
        var start=performance.now(),dur=2000;
        function step(now){
          var pr=Math.min((now-start)/dur,1),eased=1-Math.pow(1-pr,4);
          el.textContent=Math.round(target*eased);
          if(pr<1)requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.5});
  obs.observe(el);
}

/* ═══════════════════════════════════════
   CART + SHIPPING + CHECKOUT
═══════════════════════════════════════ */
function cartSave(){try{sessionStorage.setItem("sh_cart",JSON.stringify(cartItems))}catch(e){}}

function cartAdd(id,storage){
  var key=id+"__"+(storage||"default");
  var ex=cartItems.find(function(i){return i.key===key});
  if(ex)ex.qty++;
  else cartItems.push({key:key,id:id,storage:storage||"",qty:1});
  cartSave();cartUI();cartToast(id);cartOpen();
}

function cartRemove(key){
  cartItems=cartItems.filter(function(i){return i.key!==key});
  cartSave();cartUI();
}

function cartSubtotal(){
  return cartItems.reduce(function(s,item){
    var p=findProduct(item.id);if(!p)return s;
    var v=p.variants.find(function(x){return x.storage===item.storage})||p.variants[0];
    return s+v.price*item.qty;
  },0);
}
function cartGrandTotal(){return cartSubtotal()+(cartItems.length?SHIPPING[selectedShipping].price:0)}
function cartCount(){return cartItems.reduce(function(s,i){return s+i.qty},0)}

function cartUI(){
  var count=cartCount(),sub=cartSubtotal(),grand=cartGrandTotal(),ship=SHIPPING[selectedShipping];
  var countEl=Q("#shCount"),bodyEl=Q("#shCartBody"),footEl=Q("#shCartFoot"),totalEl=Q("#shCartTotal");
  var subEl=Q("#shCartSub"),shipEl=Q("#shCartShip");

  if(countEl){countEl.textContent=count;countEl.classList.toggle("show",count>0)}

  if(bodyEl){
    if(!cartItems.length){
      bodyEl.innerHTML='<div class="sh-cart-empty"><i class="fas fa-bag-shopping"></i><p>Your bag is empty.</p></div>';
      if(footEl)footEl.style.display="none";
    }else{
      var html="";
      cartItems.forEach(function(item){
        var p=findProduct(item.id);if(!p)return;
        var v=p.variants.find(function(x){return x.storage===item.storage})||p.variants[0];
        html+='<div class="sh-cart-item">'
          +'<div class="sh-cart-item-img"><img src="'+p.thumb+'" alt="'+p.name+'"></div>'
          +'<div class="sh-cart-item-info">'
          +'<div class="sh-cart-item-name">'+p.name+'</div>'
          +'<div class="sh-cart-item-var">'+(v.storage?v.storage+" &middot; ":"")+v.color+" &middot; Qty: "+item.qty+'</div>'
          +'<div class="sh-cart-item-price">$'+(v.price*item.qty).toLocaleString()+'</div>'
          +'</div>'
          +'<button class="sh-cart-item-rm" data-rm="'+item.key+'"><i class="fas fa-trash-can"></i></button>'
          +'</div>';
      });

      // Shipping selector
      html+='<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--cloud)">';
      html+='<div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--steel);margin-bottom:10px">Shipping Method</div>';

      var stdBg=selectedShipping==="standard"?"var(--blue-s)":"var(--matte)";
      var stdBorder=selectedShipping==="standard"?"var(--blue)":"var(--cloud)";
      html+='<label style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:'+stdBg+';border:1.5px solid '+stdBorder+';border-radius:var(--r-md);margin-bottom:8px;cursor:pointer;font-size:.8125rem">';
      html+='<input type="radio" name="shipping" value="standard" '+(selectedShipping==="standard"?"checked":"")+' style="accent-color:var(--blue)">';
      html+='<div style="flex:1"><div style="font-weight:600;color:var(--carbon)">Standard Shipping</div><div style="font-size:.6875rem;color:var(--steel)">3-5 business days</div></div>';
      html+='<span style="font-weight:700;color:var(--carbon)">$9.99</span></label>';

      var nycBg=selectedShipping==="nyc"?"var(--blue-s)":"var(--matte)";
      var nycBorder=selectedShipping==="nyc"?"var(--blue)":"var(--cloud)";
      html+='<label style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:'+nycBg+';border:1.5px solid '+nycBorder+';border-radius:var(--r-md);cursor:pointer;font-size:.8125rem">';
      html+='<input type="radio" name="shipping" value="nyc" '+(selectedShipping==="nyc"?"checked":"")+' style="accent-color:var(--blue)">';
      html+='<div style="flex:1"><div style="font-weight:600;color:var(--carbon)"><i class="fas fa-bolt" style="color:var(--blue);font-size:.625rem;margin-right:4px"></i>NYC Same-Day Delivery</div><div style="font-size:.6875rem;color:var(--steel)">Order by 2pm, delivered today</div></div>';
      html+='<span style="font-weight:700;color:var(--carbon)">$79.00</span></label></div>';

      bodyEl.innerHTML=html;
      if(footEl)footEl.style.display="block";
      QA("[data-rm]",bodyEl).forEach(function(btn){btn.addEventListener("click",function(){cartRemove(btn.dataset.rm)})});
      QA('input[name="shipping"]',bodyEl).forEach(function(radio){radio.addEventListener("change",function(){selectedShipping=radio.value;cartUI()})});
    }
  }
  if(subEl)subEl.textContent="$"+sub.toLocaleString();
  if(shipEl)shipEl.textContent="$"+ship.price.toFixed(2);
  if(totalEl)totalEl.textContent="$"+grand.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
}

function cartOpen(){Q("#shCartDrawer").classList.add("open");Q("#shCartOv").classList.add("open");document.body.style.overflow="hidden"}
function cartClose(){Q("#shCartDrawer").classList.remove("open");Q("#shCartOv").classList.remove("open");document.body.style.overflow=""}

function cartToast(id){
  var p=findProduct(id),t=Q("#shToast"),m=Q("#shToastMsg");
  if(!p||!t||!m)return;
  m.textContent=p.name+" added to bag!";
  t.classList.add("show");
  setTimeout(function(){t.classList.remove("show")},2500);
}

async function handleCheckout(){
  var btn=Q("#shCheckout");if(!cartItems.length||!btn)return;
  var orig=btn.innerHTML;
  btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Creating checkout...';
  btn.disabled=true;btn.style.opacity=".7";btn.style.pointerEvents="none";
  try{
    var items=[];
    cartItems.forEach(function(item){
      var p=findProduct(item.id);if(!p)return;
      var v=p.variants.find(function(x){return x.storage===item.storage})||p.variants[0];
      items.push({name:p.name+(v.storage?" "+v.storage:"")+" ("+p.cond+")",qty:item.qty,price:v.price,variant:v.color+" / Refurbished / "+p.cond});
    });
    if(!items.length)throw new Error("No valid items");
    var res=await fetch(CHECKOUT_API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({items:items,shipping:selectedShipping,redirectUrl:window.location.origin+"/shop/?order=success"})
    });
    var data=await res.json();
    if(!res.ok)throw new Error(data.detail||data.error||"Checkout failed");
    window.location.href=data.url;
  }catch(err){
    console.error("Checkout error:",err);
    alert("Checkout error: "+err.message+"\n\nPlease call (929) 417-6819 to complete your order.");
    btn.innerHTML=orig;btn.disabled=false;btn.style.opacity="1";btn.style.pointerEvents="auto";
  }
}

function checkOrderSuccess(){
  var params=new URLSearchParams(window.location.search);
  if(params.get("order")==="success"){
    cartItems=[];cartSave();cartUI();
    var t=Q("#shToast"),m=Q("#shToastMsg");
    if(t&&m){m.textContent="Order placed! We will be in touch shortly.";t.classList.add("show");setTimeout(function(){t.classList.remove("show")},6000)}
    history.replaceState(null,"",window.location.pathname);
  }
}

function initCart(){
  Q("#shCartBtn").addEventListener("click",cartOpen);
  Q("#shCartX").addEventListener("click",cartClose);
  Q("#shCartOv").addEventListener("click",cartClose);
  Q("#shCheckout").addEventListener("click",handleCheckout);
  cartUI();
}

/* ═══ SMOOTH SCROLL ═══ */
function initSmooth(){
  document.addEventListener("click",function(e){
    var link=e.target.closest('a[href^="#"]');if(!link)return;
    var href=link.getAttribute("href");
    if(href==="#"||href.indexOf("#product/")===0)return;
    var t=Q(href);
    if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-60,behavior:"smooth"})}
  });
}

/* ═══ BACK TO TOP ═══ */
function initTop(){
  var btn=Q("#shTop");if(!btn)return;
  window.addEventListener("scroll",throttle(function(){btn.classList.toggle("vis",window.scrollY>600)},200));
  btn.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});
}

/* ═══════════════════════════════════════
   BOOT
═══════════════════════════════════════ */
function boot(){
  checkOrderSuccess();
  initReveal();initProgress();initHeader();initMobile();
  initGlow();initHeroVideo();initParticles();initBadges();
  initHeroParallax();initMagnetic();
  loadProducts(function(){
    renderGrid(P);initFilters();initCompare();initBatteryCounter();checkHash();
  });
  initCart();initSmooth();initTop();
  console.log("ETW Shop V4 loaded");
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
else boot();
