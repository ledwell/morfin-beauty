(function () {
  'use strict';

  const config = window.MB_CONFIG || {};
  const collections = window.MB_COLLECTIONS || [];
  const products = window.MB_PRODUCTS || [];
  const page = document.body.dataset.page;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Shared header & footer ---------- */

  const NAV = [
    { href: 'index.html', label: 'Home', page: 'home' },
    { href: 'shop.html', label: 'Shop', page: 'shop' },
    { href: 'founder.html', label: 'Our Founder', page: 'founder' },
    { href: 'contact.html', label: 'Contact', page: 'contact' },
  ];

  const ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.8 2.2 4.6 5 5"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H8.6v3h2.7V21"/></svg>',
    bag:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
  };

  const HELP = [
    { href: 'faq.html', label: 'FAQ' },
    { href: 'shipping-returns.html', label: 'Shipping & Returns' },
    { href: 'finder.html', label: 'Find Your Red' },
    { href: 'privacy.html', label: 'Privacy Policy' },
  ];

  const money = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: config.currency || 'USD' }).format(n);

  /* ---------- Bag ---------- */

  // The bag lives in this visitor's browser only. When a payment provider is added,
  // checkout hands these lines to it instead of the demo checkout page.
  const BAG_KEY = 'mb-bag';
  let memoryBag = [];

  function readBag() {
    try {
      const saved = JSON.parse(localStorage.getItem(BAG_KEY));
      return Array.isArray(saved) ? saved : memoryBag;
    } catch (err) {
      return memoryBag;
    }
  }

  function writeBag(items) {
    memoryBag = items;
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(items));
    } catch (err) {
      /* Storage unavailable (private mode): keep the bag in memory for this page. */
    }
    updateBagCount();
  }

  function addToBag(id, shade, qty) {
    const items = readBag();
    const line = items.find((l) => l.id === id && l.shade === shade);
    if (line) line.qty = Math.min(10, line.qty + qty);
    else items.push({ id, shade, qty });
    writeBag(items);
  }

  function bagLines() {
    return readBag()
      .map((l) => ({ ...l, product: products.find((p) => p.id === l.id) }))
      .filter((l) => l.product && l.product.price != null);
  }

  function bagTotals(express) {
    const ship = config.shipping || { standard: 0, express: 0, freeOver: 0 };
    const subtotal = bagLines().reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const shipping = express ? ship.express : subtotal >= ship.freeOver ? 0 : ship.standard;
    return { subtotal, shipping, total: subtotal + shipping };
  }

  function updateBagCount() {
    const n = readBag().reduce((sum, l) => sum + l.qty, 0);
    document.querySelectorAll('[data-bag-count]').forEach((el) => {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  function showToast(html) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.innerHTML = html;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
  }

  function renderHeader() {
    const slot = document.querySelector('[data-site-header]');
    if (!slot) return;
    slot.outerHTML = `
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="brand" href="index.html" aria-label="Morfin Beauty home">
            <img class="brand__mark" src="assets/img/monogram.webp" alt="" width="600" height="451">
            <span class="brand__name">Morfin<span>Beauty</span></span>
          </a>
          <div class="site-header__right">
            <nav class="site-nav" id="site-nav" aria-label="Main">
              <ul>
                ${NAV.map(
                  (n) =>
                    `<li><a href="${n.href}"${n.page === page ? ' aria-current="page"' : ''}>${n.label}</a></li>`
                ).join('')}
              </ul>
            </nav>
            <button class="icon-btn" type="button" data-open-search aria-label="Search">${ICONS.search}</button>
            <a class="bag-link" href="bag.html"${page === 'bag' ? ' aria-current="page"' : ''}>
              ${ICONS.bag}<span class="sr-only">Bag, </span><span class="bag-count" data-bag-count hidden>0</span>
            </a>
            <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">
              <span class="sr-only">Menu</span><span class="nav-toggle__bar"></span>
            </button>
          </div>
        </div>
      </header>`;

    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    const header = document.querySelector('.site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function renderFooter() {
    const slot = document.querySelector('[data-site-footer]');
    if (!slot) return;
    const social = config.social || {};
    const year = new Date().getFullYear();
    slot.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <section class="inner-circle" aria-labelledby="inner-circle-title">
            <img class="inner-circle__crown" src="assets/img/crown-monogram.png" alt="" width="96" height="96" loading="lazy">
            <p class="eyebrow">An invitation</p>
            <h2 id="inner-circle-title" class="display">Join the Inner Circle</h2>
            <p class="lede">First to know of every launch, every shade, every private moment from Morfin Beauty.</p>
            <form class="inline-form" data-form="inner-circle">
              <input type="hidden" name="form" value="Inner Circle">
              <label class="sr-only" for="ic-email">Email address</label>
              <input id="ic-email" type="email" name="email" placeholder="Your email address" required autocomplete="email">
              <button class="btn btn--gold" type="submit">Join</button>
              <p class="form-status" role="status" aria-live="polite"></p>
            </form>
          </section>

          <div class="footer-grid">
            <div class="footer-brand">
              <img src="assets/img/wordmark.webp" alt="Morfin Beauty. Luxury Lips. Lasting Impression." width="760" height="320" loading="lazy">
            </div>
            <nav aria-label="Footer">
              <h3 class="footer-title">Explore</h3>
              <ul>
                ${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
              </ul>
            </nav>
            <div>
              <h3 class="footer-title">The Collections</h3>
              <ul>
                ${collections.map((c) => `<li><a href="shop.html#${c.id}">${esc(c.short)}</a></li>`).join('')}
              </ul>
            </div>
            <nav aria-label="Help">
              <h3 class="footer-title">Help</h3>
              <ul>
                ${HELP.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}
              </ul>
            </nav>
            <div>
              <h3 class="footer-title">Follow</h3>
              <ul class="social">
                ${Object.keys(social)
                  .map(
                    (k) =>
                      `<li><a href="${esc(social[k])}" target="_blank" rel="noopener" aria-label="${k}">${ICONS[k] || ''}</a></li>`
                  )
                  .join('')}
              </ul>
              <p><a href="mailto:${esc(config.email)}">${esc(config.email)}</a></p>
            </div>
          </div>

          <div class="footer-legal">
            <p>&copy; ${year} Morfin Beauty. All rights reserved.</p>
            <p><a href="privacy.html">Privacy Policy</a></p>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- Products ---------- */

  // Gold line drawings for products that have no photograph yet.
  const ART = {
    perfume: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <rect x="48" y="10" width="24" height="22" rx="3"/><rect x="54" y="32" width="12" height="10"/>
      <path d="M30 42h60l8 18v80a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10V60z"/>
      <path d="M34 66h52M60 92l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/></svg>`,
    'perfume-round': `<svg viewBox="0 0 120 160" aria-hidden="true">
      <path d="M50 14h20v18H50z"/><path d="M46 32h28v10H46z"/>
      <circle cx="60" cy="98" r="50"/><circle cx="60" cy="98" r="38" stroke-dasharray="2 5"/>
      <path d="M60 82l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/></svg>`,
    foundation: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <rect x="44" y="12" width="32" height="34" rx="4"/><path d="M50 46h20v8H50z"/>
      <rect x="30" y="54" width="60" height="96" rx="8"/><path d="M30 76h60"/>
      <path d="M60 100l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/></svg>`,
    compact: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <ellipse cx="60" cy="58" rx="46" ry="14"/><path d="M14 58v8c0 8 20 14 46 14s46-6 46-14v-8"/>
      <ellipse cx="60" cy="110" rx="46" ry="14"/><path d="M14 110v10c0 8 20 14 46 14s46-6 46-14v-10"/>
      <ellipse cx="60" cy="110" rx="32" ry="8" stroke-dasharray="2 4"/>
      <path d="M60 34l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>`,
    highlighter: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <rect x="18" y="50" width="84" height="84" rx="10"/><rect x="28" y="60" width="64" height="64" rx="6"/>
      <path d="M36 112l20-36 8 14 6-8 14 30z" stroke-dasharray="2 4"/>
      <path d="M60 18l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/></svg>`,
    gift: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <rect x="18" y="62" width="84" height="80" rx="3"/><rect x="12" y="46" width="96" height="18" rx="2"/>
      <path d="M60 46v96"/><path d="M60 46c-8-14-26-20-30-10s16 10 30 10c14 0 34 0 30-10s-22-4-30 10z"/>
      <path d="M60 92l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/></svg>`,
  };

  function collectionById(id) {
    return collections.find((c) => c.id === id) || { short: id, name: id };
  }

  const productUrl = (p) => 'product.html?id=' + encodeURIComponent(p.id);
  const priceLabel = (p) => (p.price != null ? money(p.price) : 'Price TBA');

  function productMedia(p, eager) {
    return p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}"${eager ? '' : ' loading="lazy"'}>`
      : `<div class="product-card__art">${ART[p.art] || ART.perfume}</div>`;
  }

  function swatchButtons(p) {
    return (p.shades || [])
      .map(
        (s, i) =>
          `<button class="swatch" type="button" style="--c:${esc(s.hex)}" data-shade="${esc(s.name)}" aria-label="${esc(s.name)}" aria-pressed="${i === 0}"></button>`
      )
      .join('');
  }

  const shadeCount = (n) => (n > 1 ? ` &middot; ${n} shades` : '');

  function productCard(p) {
    const shades = p.shades || [];
    return `
      <article class="product-card reveal" data-collection="${esc(p.collection)}" data-product-scope="${esc(p.id)}">
        <a class="product-card__media${p.image ? '' : ' is-placeholder'}" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">
          ${p.badge ? `<span class="product-card__badge">${esc(p.badge)}</span>` : ''}
          ${productMedia(p)}
        </a>
        <h3 class="product-card__name"><a href="${productUrl(p)}">${esc(p.name)}</a></h3>
        <p class="product-card__type">${esc(p.type || collectionById(p.collection).short)}</p>
        <div class="swatches">${swatchButtons(p)}</div>
        <p class="product-card__shade" data-shade-label data-count="${shades.length}">${shades.length ? esc(shades[0].name) + shadeCount(shades.length) : ''}</p>
        <p class="product-card__price">${priceLabel(p)}</p>
        <button class="btn-bag" type="button" data-add="${esc(p.id)}"${p.price == null ? ' disabled' : ''}>Add to Bag</button>
      </article>`;
  }

  // Swatch clicks change the selected shade on a product card or product page.
  document.addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;
    const scope = swatch.closest('[data-product-scope]');
    scope.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', String(s === swatch)));
    const label = scope.querySelector('[data-shade-label]');
    label.innerHTML = esc(swatch.dataset.shade) + shadeCount(Number(label.dataset.count || 0));
    showShadeImage(scope, swatch.dataset.shade);
  });

  // When a shade has its own photo, show it in that card or product page.
  function showShadeImage(scope, shadeName) {
    const p = products.find((x) => x.id === scope.dataset.productScope);
    const img = scope.querySelector('.product-card__media img');
    if (!p || !img) return;
    const shade = (p.shades || []).find((s) => s.name === shadeName);
    img.src = (shade && shade.image) || p.image;
  }

  // "Add to Bag" on cards and product pages.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const p = products.find((x) => x.id === btn.dataset.add);
    if (!p || p.price == null) return;
    const scope = btn.closest('[data-product-scope]');
    const picked = scope && scope.querySelector('.swatch[aria-pressed="true"]');
    const shade = picked ? picked.dataset.shade : '';
    const qtyInput = scope && scope.querySelector('[data-qty]');
    const qty = qtyInput ? Math.max(1, Math.min(10, parseInt(qtyInput.value, 10) || 1)) : 1;
    addToBag(p.id, shade, qty);
    showToast(
      `<span>Added to your bag: <strong>${esc(p.name)}</strong>${shade ? `, ${esc(shade)}` : ''}</span><a href="bag.html">View bag</a>`
    );
  });

  /* ---------- Mobile carousels ---------- */

  // On narrow screens .carousel lists scroll sideways (see CSS); these dots track position.
  function initCarousel(track) {
    let dots = track.nextElementSibling;
    if (!dots || !dots.classList.contains('carousel-dots')) {
      dots = document.createElement('div');
      dots.className = 'carousel-dots';
      track.after(dots);
    }
    const items = Array.from(track.children);
    dots.innerHTML = items
      .map((_, i) => `<button type="button" aria-label="Go to item ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`)
      .join('');

    const buttons = Array.from(dots.children);
    const current = () => {
      const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : 1;
      return Math.max(0, Math.min(items.length - 1, Math.round(track.scrollLeft / step)));
    };
    track.onscroll = () => {
      const i = current();
      buttons.forEach((b, j) => (j === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    };
    dots.onclick = (e) => {
      const i = buttons.indexOf(e.target);
      if (i < 0) return;
      track.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: 'smooth' });
    };
  }

  function initCarousels(root) {
    (root || document).querySelectorAll('.carousel').forEach(initCarousel);
  }

  function renderFeatured() {
    const grid = document.querySelector('[data-featured-products]');
    if (!grid) return;
    grid.innerHTML = products.filter((p) => p.featured).map(productCard).join('');
  }

  function renderShop() {
    const grid = document.querySelector('[data-shop-products]');
    if (!grid) return;
    const filters = document.querySelector('[data-shop-filters]');
    const heading = document.querySelector('[data-shop-heading]');
    const blurb = document.querySelector('[data-shop-blurb]');

    const tabs = [{ id: 'all', short: 'All' }].concat(collections);
    filters.innerHTML = tabs
      .map((t) => `<li><button type="button" data-filter="${t.id}">${esc(t.short)}</button></li>`)
      .join('');

    function group(col) {
      const list = products.filter((p) => p.collection === col.id);
      if (!list.length) return '';
      return `
        <section class="shop-group">
          <div class="shop-group__head"><h2>${esc(col.short)}</h2>${
            col.id === 'lips' ? '<a href="finder.html">Find your red &rarr;</a>' : `<span>${list.length} pieces</span>`
          }</div>
          <div class="product-grid carousel">${list.map(productCard).join('')}</div>
        </section>`;
    }

    function apply(id) {
      if (!tabs.some((t) => t.id === id)) id = 'all';
      const shown = id === 'all' ? collections : collections.filter((c) => c.id === id);
      grid.innerHTML = shown.map(group).join('');
      initCarousels(grid);
      filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
      const col = collections.find((c) => c.id === id);
      heading.textContent = col ? col.name : 'The Collections';
      blurb.textContent = col ? col.blurb : 'Every piece, crafted to be adored. Our full range arrives soon.';
      observeReveals(grid);
    }

    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const id = btn.dataset.filter;
      history.replaceState(null, '', id === 'all' ? location.pathname : '#' + id);
      apply(id);
    });
    window.addEventListener('hashchange', () => apply(location.hash.slice(1)));
    apply(location.hash.slice(1));
  }

/* ---------- Product page ---------- */

  const HOW_TO = {
    lips: 'Apply from the center of the lips outward. Layer for deeper color.',
    fragrance: 'Mist onto pulse points: wrists, the base of the throat and behind the ears.',
    face: 'Apply with fingertips or a brush, building where you want more.',
  };

  function renderProduct() {
    const root = document.querySelector('[data-product-page]');
    if (!root) return;
    const p = products.find((x) => x.id === new URLSearchParams(location.search).get('id'));
    if (!p) {
      root.innerHTML = `
        <div class="empty-state">
          <h1 class="display">Not found</h1>
          <p class="lede">We couldn't find that piece. It may have moved.</p>
          <a class="btn btn--gold" href="shop.html">Back to the shop</a>
        </div>`;
      return;
    }

    const col = collectionById(p.collection);
    const shades = p.shades || [];
    document.title = `${p.name} | Morfin Beauty`;
    // Links such as the shade finder can preselect a shade with &shade=Name.
    const wanted = new URLSearchParams(location.search).get('shade');
    const startShade = Math.max(0, shades.findIndex((s) => s.name === wanted));
    const included = (p.includes || []).map((id) => products.find((x) => x.id === id)).filter(Boolean);

    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="shop.html">Shop</a><span aria-hidden="true">/</span><a href="shop.html#${esc(p.collection)}">${esc(col.short)}</a>
      </nav>
      <div class="product-page" data-product-scope="${esc(p.id)}">
        <div class="product-page__media product-card__media${p.image ? '' : ' is-placeholder'}">
          ${p.badge ? `<span class="product-card__badge">${esc(p.badge)}</span>` : ''}
          ${productMedia(p, true)}
        </div>
        <div class="product-page__info">
          <p class="eyebrow">${esc(col.name)}</p>
          <h1 class="product-page__name">${esc(p.name)}</h1>
          <p class="product-page__type">${esc(p.type || '')}</p>
          <p class="product-page__price">${priceLabel(p)}</p>
          <p class="product-page__desc">${esc(p.description)}</p>
          ${
            included.length
              ? `<p class="product-page__label">In the set</p>
                 <ul class="set-list">${included
                   .map((x) => `<li><a href="${productUrl(x)}">${esc(x.name)}</a> <span>${esc(x.type || '')}</span></li>`)
                   .join('')}</ul>`
              : ''
          }
          ${
            shades.length
              ? `<div class="product-page__shades">
                   <p class="product-page__label">Shade: <span data-shade-label data-count="0">${esc(shades[startShade].name)}</span></p>
                   <div class="swatches swatches--lg">${swatchButtons(p)}</div>
                 </div>`
              : ''
          }
          <div class="product-page__buy">
            <div class="qty">
              <button type="button" data-qty-step="-1" aria-label="Decrease quantity">&minus;</button>
              <input type="number" data-qty value="1" min="1" max="10" aria-label="Quantity">
              <button type="button" data-qty-step="1" aria-label="Increase quantity">+</button>
            </div>
            <button class="btn-bag" type="button" data-add="${esc(p.id)}"${p.price == null ? ' disabled' : ''}>Add to Bag</button>
          </div>
          <details class="details" open>
            <summary>How to wear</summary>
            <p>${esc(HOW_TO[p.collection] || '')}</p>
          </details>
          <details class="details">
            <summary>Ingredients</summary>
            <p>Full ingredient list coming soon.</p>
          </details>
          <details class="details">
            <summary>Shipping &amp; returns</summary>
            <p>Free standard shipping on orders over ${money((config.shipping || {}).freeOver || 0)}. Unopened items can be returned within 30 days.</p>
          </details>
        </div>
      </div>`;

    root.addEventListener('click', (e) => {
      const step = e.target.closest('[data-qty-step]');
      if (!step) return;
      const input = root.querySelector('[data-qty]');
      input.value = Math.max(1, Math.min(10, (parseInt(input.value, 10) || 1) + Number(step.dataset.qtyStep)));
    });

    if (startShade > 0) {
      const scope = root.querySelector('[data-product-scope]');
      scope.querySelectorAll('.swatch').forEach((s, i) => s.setAttribute('aria-pressed', String(i === startShade)));
      showShadeImage(scope, shades[startShade].name);
    }

    const pairs = (p.pairsWith || []).map((id) => products.find((x) => x.id === id)).filter(Boolean);
    const lookGrid = document.querySelector('[data-look-products]');
    if (lookGrid) {
      if (pairs.length) lookGrid.innerHTML = pairs.map(productCard).join('');
      else lookGrid.closest('section').hidden = true;
    }

    const related = document.querySelector('[data-related-products]');
    if (related) {
      const skip = new Set([p.id, ...pairs.map((x) => x.id)]);
      const same = products.filter((x) => x.collection === p.collection && !skip.has(x.id));
      const others = products.filter((x) => x.collection !== p.collection && !skip.has(x.id));
      related.innerHTML = same.concat(others).slice(0, 4).map(productCard).join('');
    }
  }

  /* ---------- Bag page ---------- */

  const GIFT_KEY = 'mb-gift';

  function readGift() {
    try {
      return JSON.parse(localStorage.getItem(GIFT_KEY)) || {};
    } catch (err) {
      return {};
    }
  }

  function writeGift(gift) {
    try {
      localStorage.setItem(GIFT_KEY, JSON.stringify(gift));
    } catch (err) {
      /* Storage unavailable: the choice lasts for this page only. */
    }
  }

  function summaryRows(totals) {
    return `
      <div class="summary__row"><span>Subtotal</span><span>${money(totals.subtotal)}</span></div>
      <div class="summary__row"><span>Shipping</span><span>${totals.shipping ? money(totals.shipping) : 'Free'}</span></div>
      ${readGift().wrap ? '<div class="summary__row"><span>Gift wrapping</span><span>Complimentary</span></div>' : ''}
      <div class="summary__row summary__row--total"><span>Total</span><span>${money(totals.total)}</span></div>`;
  }

  function lineThumb(p, asImage) {
    const cls = `line__thumb product-card__media${p.image ? '' : ' is-placeholder'}`;
    return asImage
      ? `<span class="${cls}">${productMedia(p)}</span>`
      : `<a class="${cls}" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">${productMedia(p)}</a>`;
  }

  function renderBag() {
    const root = document.querySelector('[data-bag-page]');
    if (!root) return;
    // Drop lines for products that no longer exist so line numbers match what is drawn.
    writeBag(readBag().filter((l) => products.some((p) => p.id === l.id && p.price != null)));

    function draw() {
      const lines = bagLines();
      if (!lines.length) {
        root.innerHTML = `
          <div class="empty-state">
            <p class="lede">Your bag is empty.</p>
            <a class="btn btn--gold" href="shop.html">Shop the Collection <span class="arrow">&rarr;</span></a>
          </div>`;
        return;
      }
      const ship = config.shipping || {};
      const totals = bagTotals(false);
      const gift = readGift();
      root.innerHTML = `
        <div class="checkout-grid">
          <ul class="lines">
            ${lines
              .map(
                (l, i) => `
              <li class="line">
                ${lineThumb(l.product)}
                <div class="line__info">
                  <a class="line__name" href="${productUrl(l.product)}">${esc(l.product.name)}</a>
                  <p class="line__meta">${esc(l.shade || l.product.type || '')}</p>
                  <div class="qty qty--sm">
                    <button type="button" data-line-step="-1" data-line="${i}" aria-label="Decrease quantity">&minus;</button>
                    <span>${l.qty}</span>
                    <button type="button" data-line-step="1" data-line="${i}" aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div class="line__end">
                  <p class="line__price">${money(l.product.price * l.qty)}</p>
                  <button class="line__remove" type="button" data-line-remove="${i}">Remove</button>
                </div>
              </li>`
              )
              .join('')}
          </ul>
          <aside class="summary">
            <h2>Summary</h2>
            <div class="ship-progress">
              <p class="summary__note" style="margin:0">${
                totals.subtotal < ship.freeOver
                  ? `You're ${money(ship.freeOver - totals.subtotal)} away from free standard shipping.`
                  : `You've unlocked free standard shipping.`
              }</p>
              <div class="ship-progress__bar" aria-hidden="true"><span style="width:${Math.min(100, (totals.subtotal / ship.freeOver) * 100)}%"></span></div>
            </div>
            ${summaryRows(totals)}
            <div class="gift">
              <label><input type="checkbox" data-gift-wrap${gift.wrap ? ' checked' : ''}> Add complimentary gift wrapping</label>
              <div data-gift-extra${gift.wrap ? '' : ' hidden'}>
                <label class="sr-only" for="gift-note">Gift message</label>
                <textarea id="gift-note" rows="3" maxlength="200" placeholder="Add a gift message (optional)" data-gift-note>${esc(gift.note || '')}</textarea>
              </div>
            </div>
            <a class="btn btn--gold summary__cta" href="checkout.html">Checkout</a>
            <a class="summary__link" href="shop.html">Continue shopping</a>
          </aside>
        </div>`;
    }

    root.addEventListener('click', (e) => {
      const items = readBag();
      const step = e.target.closest('[data-line-step]');
      const remove = e.target.closest('[data-line-remove]');
      if (step) {
        const line = items[Number(step.dataset.line)];
        if (!line) return;
        line.qty = Math.max(1, Math.min(10, line.qty + Number(step.dataset.lineStep)));
      } else if (remove) {
        items.splice(Number(remove.dataset.lineRemove), 1);
      } else {
        return;
      }
      writeBag(items);
      draw();
    });

    root.addEventListener('change', (e) => {
      if (!e.target.matches('[data-gift-wrap]')) return;
      writeGift({ ...readGift(), wrap: e.target.checked });
      root.querySelector('[data-gift-extra]').hidden = !e.target.checked;
    });
    root.addEventListener('input', (e) => {
      if (e.target.matches('[data-gift-note]')) writeGift({ ...readGift(), note: e.target.value });
    });

    draw();
  }

  /* ---------- Demo checkout ---------- */

  // Stands in for the payment provider's checkout. Nothing is sent or charged.
  function renderCheckout() {
    const root = document.querySelector('[data-checkout-page]');
    if (!root) return;
    const lines = bagLines();
    if (!lines.length) {
      root.innerHTML = `
        <div class="empty-state">
          <p class="lede">Your bag is empty, so there's nothing to check out yet.</p>
          <a class="btn btn--gold" href="shop.html">Shop the Collection <span class="arrow">&rarr;</span></a>
        </div>`;
      return;
    }
    const ship = config.shipping || {};
    const standardLabel = bagTotals(false).shipping ? money(ship.standard) : 'Free';

    root.innerHTML = `
      <p class="demo-note">This is a demonstration checkout. No payment is taken and no order is placed.</p>
      <form class="checkout-grid" data-checkout novalidate>
        <div class="checkout-form">
          <fieldset>
            <legend>Contact</legend>
            <div class="field"><label for="co-email">Email</label><input id="co-email" type="email" name="email" required autocomplete="email"></div>
          </fieldset>
          <fieldset>
            <legend>Shipping address</legend>
            <div class="row">
              <div class="field"><label for="co-first">First name</label><input id="co-first" name="first" required autocomplete="given-name"></div>
              <div class="field"><label for="co-last">Last name</label><input id="co-last" name="last" required autocomplete="family-name"></div>
            </div>
            <div class="field"><label for="co-address">Address</label><input id="co-address" name="address" required autocomplete="street-address"></div>
            <div class="row row--3">
              <div class="field"><label for="co-city">City</label><input id="co-city" name="city" required autocomplete="address-level2"></div>
              <div class="field"><label for="co-state">State</label><input id="co-state" name="state" required autocomplete="address-level1"></div>
              <div class="field"><label for="co-zip">ZIP code</label><input id="co-zip" name="zip" required autocomplete="postal-code"></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Shipping method</legend>
            <label class="radio-card"><input type="radio" name="method" value="standard" checked><span>Standard, 5&ndash;7 business days</span><strong>${standardLabel}</strong></label>
            <label class="radio-card"><input type="radio" name="method" value="express"><span>Express, 2&ndash;3 business days</span><strong>${money(ship.express)}</strong></label>
          </fieldset>
          <fieldset>
            <legend>Payment</legend>
            <div class="payment-placeholder">
              <p><strong>Secure payment</strong></p>
              <p>Card, Apple Pay and Google Pay will be handled by our payment provider here. Card details are never stored on this site.</p>
            </div>
          </fieldset>
          <button class="btn btn--gold checkout-submit" type="submit">Place Demo Order</button>
        </div>
        <aside class="summary">
          <h2>Your order</h2>
          <ul class="summary__lines">
            ${lines
              .map(
                (l) => `
              <li>
                ${lineThumb(l.product, true)}
                <div><p class="line__name">${esc(l.product.name)}</p><p class="line__meta">${esc(l.shade || l.product.type || '')} &middot; Qty ${l.qty}</p></div>
                <span>${money(l.product.price * l.qty)}</span>
              </li>`
              )
              .join('')}
          </ul>
          <div data-checkout-totals>${summaryRows(bagTotals(false))}</div>
        </aside>
      </form>`;

    const form = root.querySelector('[data-checkout]');
    form.addEventListener('change', () => {
      root.querySelector('[data-checkout-totals]').innerHTML = summaryRows(bagTotals(form.elements.method.value === 'express'));
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const email = form.elements.email.value;
      const orderNo = 'MB-' + String(Math.floor(100000 + Math.random() * 900000));
      writeBag([]);
      writeGift({});
      root.innerHTML = `
        <div class="empty-state confirm">
          <p class="eyebrow">Demo order ${orderNo}</p>
          <h2 class="display">Thank you</h2>
          <p class="lede">In the live store, a confirmation would now be emailed to ${esc(email)}. This was a demonstration, so nothing was charged.</p>
          <a class="btn btn--gold" href="shop.html">Back to the shop</a>
        </div>`;
      window.scrollTo(0, 0);
    });
  }

/* ---------- Search ---------- */

  function bindSearch() {
    const dialog = document.createElement('dialog');
    dialog.className = 'search-dialog';
    dialog.setAttribute('aria-label', 'Search products');
    dialog.innerHTML = `
      <div class="search-dialog__bar">
        ${ICONS.search}
        <label class="sr-only" for="site-search">Search products</label>
        <input id="site-search" type="search" placeholder="Search lipstick, gloss, a shade like Merlot&hellip;" autocomplete="off">
        <button class="search-dialog__close" type="button" data-close-search aria-label="Close search">&times;</button>
      </div>
      <div data-search-results></div>`;
    document.body.appendChild(dialog);

    const input = dialog.querySelector('input');
    const out = dialog.querySelector('[data-search-results]');
    const words = (p) =>
      [p.name, p.type, collectionById(p.collection).name, ...(p.shades || []).map((s) => s.name)].join(' ').toLowerCase();

    function search(q) {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return products.filter((p) => p.featured).map((p) => ({ p }));
      return products
        .filter((p) => terms.every((t) => words(p).includes(t)))
        .map((p) => ({ p, shade: (p.shades || []).find((s) => terms.some((t) => s.name.toLowerCase().includes(t))) }));
    }

    function draw() {
      const q = input.value.trim();
      const hits = search(q);
      out.innerHTML = hits.length
        ? `<p class="search-dialog__heading">${q ? 'Products' : 'Popular'}</p>
           <ul class="search-dialog__results">${hits
             .map(
               ({ p, shade }) => `
             <li><a class="search-result" href="${productUrl(p)}${shade ? '&shade=' + encodeURIComponent(shade.name) : ''}">
               ${lineThumb(p, true)}
               <span><strong>${esc(p.name)}</strong><small>${esc(shade ? 'Shade: ' + shade.name : p.type || '')}</small></span>
               <span>${priceLabel(p)}</span>
             </a></li>`
             )
             .join('')}</ul>`
        : `<p class="search-dialog__empty">No results for &ldquo;${esc(q)}&rdquo;. Try &ldquo;lipstick&rdquo;, &ldquo;gloss&rdquo; or a shade such as &ldquo;Merlot&rdquo;.</p>`;
    }

    input.addEventListener('input', draw);
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const first = out.querySelector('.search-result');
      if (first) location.href = first.href;
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.closest('[data-close-search]')) dialog.close();
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-open-search]')) return;
      draw();
      dialog.showModal();
      input.focus();
    });
  }

  /* ---------- Inner Circle pop-up ---------- */

  // Shown once per visitor, after a pause or partway down the page. Never on the bag
  // or checkout. Add ?popup to any page URL to see it again when demoing.
  function bindPopup() {
    const KEY = 'mb-popup-seen';
    const force = new URLSearchParams(location.search).has('popup');
    if (page === 'bag' || page === 'checkout') return;
    const remember = () => {
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch (err) {
        /* ignore */
      }
    };
    let seen = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch (err) {
      return; // Without storage we can't remember a dismissal, so don't risk showing it on every page.
    }
    // Anyone who joins from the footer shouldn't be asked again.
    document.addEventListener('submit', (e) => {
      if (e.target.matches('[data-form="inner-circle"]')) remember();
    });
    if (seen && !force) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'ic-popup';
    dialog.setAttribute('aria-labelledby', 'ic-popup-title');
    dialog.innerHTML = `
      <div class="ic-popup__media" aria-hidden="true"></div>
      <div class="ic-popup__body">
        <button class="ic-popup__close" type="button" aria-label="Close">&times;</button>
        <p class="eyebrow">An invitation</p>
        <h2 class="display" id="ic-popup-title">Join the Inner Circle</h2>
        <p>Early access to every launch, a first look at new shades, and private offers for members.</p>
        <form class="inline-form" data-form="inner-circle" data-success="Welcome to the Inner Circle.">
          <input type="hidden" name="form" value="Inner Circle (pop-up)">
          <label class="sr-only" for="ic-pop-email">Email address</label>
          <input id="ic-pop-email" type="email" name="email" placeholder="Your email address" required autocomplete="email" autofocus>
          <button class="btn btn--gold" type="submit">Join</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
        <p class="ic-popup__fine">Unsubscribe anytime. See our <a href="privacy.html">Privacy Policy</a>.</p>
      </div>`;
    document.body.appendChild(dialog);

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.closest('.ic-popup__close')) dialog.close();
    });

    let shown = false;
    const show = () => {
      if (shown || document.querySelector('dialog[open]') || document.body.classList.contains('nav-open')) return;
      shown = true;
      remember();
      window.removeEventListener('scroll', onScroll);
      dialog.showModal();
    };
    const onScroll = () => {
      if (window.scrollY > (document.documentElement.scrollHeight - window.innerHeight) * 0.45) show();
    };
    setTimeout(show, force ? 800 : 12000);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Find Your Red (shade finder) ---------- */

  const FINDER = [
    {
      name: 'finish',
      q: 'How do you like your lips to feel?',
      options: [
        ['matte', 'Velvet matte', 'Soft, blurred and long-wearing'],
        ['shine', 'High shine', 'Glossy, plush and light-catching'],
        ['sheer', 'Sheer glow', 'A wash of color that cares for lips'],
      ],
    },
    {
      name: 'mood',
      q: 'What is the moment?',
      options: [
        ['classic', 'Timeless', 'The red you reach for again and again'],
        ['bold', 'After dark', 'Deep, dramatic, unforgettable'],
        ['soft', 'Every day', 'Effortless color for any hour'],
      ],
    },
    {
      name: 'tone',
      q: 'Which jewelry flatters you most?',
      options: [
        ['cool', 'Silver', 'Usually a sign of cool undertones'],
        ['warm', 'Gold', 'Usually a sign of warm undertones'],
        ['neutral', 'Both equally', 'Usually a sign of neutral undertones'],
      ],
    },
  ];

  // Answers to [product id, shade name]. Placeholder logic until real shades exist.
  function finderPick(a) {
    if (a.finish === 'matte') {
      if (a.mood === 'bold') return ['rouge-royale-lipstick', 'Merlot'];
      if (a.mood === 'soft') return ['rouge-royale-lipstick', a.tone === 'warm' ? 'Nude Rose' : 'Rosewood'];
      return ['rouge-royale-lipstick', 'Classic Rouge'];
    }
    if (a.finish === 'shine') {
      if (a.mood === 'soft') return ['rose-gold-shimmer-gloss', a.tone === 'warm' ? 'Rose Gold' : 'Champagne'];
      if (a.mood === 'bold') return ['signature-lip-gloss', 'Garnet'];
      return ['signature-lip-gloss', a.tone === 'cool' ? 'Cherry Kiss' : 'Ruby'];
    }
    return ['glow-lip-oil', a.tone === 'warm' ? 'Golden Glow' : 'Rose Glow'];
  }

  function renderFinder() {
    const root = document.querySelector('[data-finder]');
    if (!root) return;

    function drawQuiz() {
      root.innerHTML = `
        <form class="finder" novalidate>
          ${FINDER.map(
            (step, i) => `
            <fieldset class="finder__step">
              <legend><span>Question ${i + 1} of ${FINDER.length}</span>${esc(step.q)}</legend>
              <div class="finder__options">
                ${step.options
                  .map(
                    ([value, label, hint]) => `
                  <label class="finder__option">
                    <input type="radio" name="${step.name}" value="${value}" required>
                    <span>${esc(label)}<small>${esc(hint)}</small></span>
                  </label>`
                  )
                  .join('')}
              </div>
            </fieldset>`
          ).join('')}
          <button class="btn btn--gold" type="submit">Reveal My Red <span class="arrow">&rarr;</span></button>
        </form>`;
      root.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const answers = Object.fromEntries(new FormData(form));
        drawResult(...finderPick(answers));
      });
    }

    function drawResult(id, shadeName) {
      const p = products.find((x) => x.id === id);
      const shade = (p.shades || []).find((s) => s.name === shadeName) || (p.shades || [])[0];
      root.innerHTML = `
        <div class="finder-result" data-product-scope="${esc(p.id)}">
          <div class="product-card__media">${productMedia(p, true)}</div>
          <div>
            <p class="eyebrow">Your red</p>
            <h2>${esc(p.name)}</h2>
            <p class="finder-result__shade"><i style="--c:${esc(shade.hex)}"></i>${esc(shade.name)}</p>
            <p>${esc(p.description)}</p>
            <p class="product-page__price">${priceLabel(p)}</p>
            <button class="swatch" type="button" hidden data-shade="${esc(shade.name)}" aria-pressed="true"></button>
            <div class="actions">
              <button class="btn btn--gold" type="button" data-add="${esc(p.id)}">Add to Bag</button>
              <a class="btn btn--ghost" href="${productUrl(p)}&shade=${encodeURIComponent(shade.name)}">View Details</a>
            </div>
            <p style="margin-top:1.4rem"><a href="finder.html" data-restart>Take the quiz again</a></p>
          </div>
        </div>`;
      showShadeImage(root.querySelector('[data-product-scope]'), shade.name);
      root.querySelector('[data-restart]').addEventListener('click', (e) => {
        e.preventDefault();
        drawQuiz();
      });
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    drawQuiz();
  }

/* ---------- Forms ---------- */

  async function submitForm(form) {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    button.disabled = true;
    status.textContent = '';
    try {
      if (config.formEndpoint) {
        const res = await fetch(config.formEndpoint, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('Request failed: ' + res.status);
      } else {
        console.warn('MB_CONFIG.formEndpoint is not set; form submission was not sent.', Object.fromEntries(data));
      }
      form.reset();
      form.classList.add('is-sent');
      status.textContent = form.dataset.success || 'Thank you. Welcome to the Inner Circle.';
    } catch (err) {
      console.error(err);
      status.textContent = 'Something went wrong. Please try again in a moment.';
    } finally {
      button.disabled = false;
    }
  }

  function bindForms() {
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-form]');
      if (!form) return;
      e.preventDefault();
      submitForm(form);
    });
  }

  /* ---------- Contact details on the contact page ---------- */

  function fillContactDetails() {
    document.querySelectorAll('[data-config-email]').forEach((el) => {
      el.href = 'mailto:' + config.email;
      el.textContent = config.email;
    });
    document.querySelectorAll('[data-config-social]').forEach((el) => {
      const url = (config.social || {})[el.dataset.configSocial];
      if (url) el.href = url;
    });
  }

  /* ---------- Reveal on scroll ---------- */

  let observer = null;
  function observeReveals(root) {
    const els = (root || document).querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    observer =
      observer ||
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
    els.forEach((el) => observer.observe(el));
  }

  renderHeader();
  renderFooter();
  renderFeatured();
  renderShop();
  renderProduct();
  renderBag();
  renderCheckout();
  renderFinder();
  bindSearch();
  bindPopup();
  initCarousels();
  updateBagCount();
  fillContactDetails();
  bindForms();
  observeReveals();
})();
