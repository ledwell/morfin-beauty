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
  };

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
          <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">
            <span class="sr-only">Menu</span><span class="nav-toggle__bar"></span>
          </button>
          <nav class="site-nav" id="site-nav" aria-label="Main">
            <ul>
              ${NAV.map(
                (n) =>
                  `<li><a href="${n.href}"${n.page === page ? ' aria-current="page"' : ''}>${n.label}</a></li>`
              ).join('')}
            </ul>
          </nav>
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
  };

  function collectionById(id) {
    return collections.find((c) => c.id === id) || { short: id, name: id };
  }

  function productCard(p) {
    const shades = p.shades || [];
    const media = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="product-card__art">${ART[p.art] || ART.perfume}</div>`;
    const swatches = shades
      .map(
        (s, i) =>
          `<button class="swatch" type="button" style="--c:${esc(s.hex)}" data-shade="${esc(s.name)}" aria-label="${esc(s.name)}" aria-pressed="${i === 0}"></button>`
      )
      .join('');
    return `
      <article class="product-card reveal" data-collection="${esc(p.collection)}">
        <div class="product-card__media${p.image ? '' : ' is-placeholder'}">
          ${p.badge ? `<span class="product-card__badge">${esc(p.badge)}</span>` : ''}
          ${media}
        </div>
        <h3 class="product-card__name">${esc(p.name)}</h3>
        <p class="product-card__type">${esc(p.type || collectionById(p.collection).short)}</p>
        <div class="swatches">${swatches}</div>
        <p class="product-card__shade">${shades.length ? esc(shades[0].name) + (shades.length > 1 ? ` &middot; ${shades.length} shades` : '') : ''}</p>
        <p class="product-card__price">${p.price ? esc(p.price) : 'Price TBA'}</p>
        <button class="btn-bag" type="button" data-notify="${esc(p.id)}">Notify Me</button>
      </article>`;
  }

  // Swatch clicks change the shade shown on that card.
  document.addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;
    const card = swatch.closest('.product-card');
    card.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', String(s === swatch)));
    const count = card.querySelectorAll('.swatch').length;
    card.querySelector('.product-card__shade').innerHTML =
      esc(swatch.dataset.shade) + (count > 1 ? ` &middot; ${count} shades` : '');
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
          <div class="shop-group__head"><h2>${esc(col.short)}</h2><span>${list.length} pieces</span></div>
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

  /* ---------- Notify Me dialog ---------- */

  function bindNotify() {
    const dialog = document.createElement('dialog');
    dialog.className = 'notify-dialog';
    dialog.innerHTML = `
      <form method="dialog" class="notify-dialog__close"><button aria-label="Close">&times;</button></form>
      <img src="assets/img/crown-monogram.png" alt="" width="72" height="72">
      <p class="eyebrow">Be the first</p>
      <h2 class="display" data-notify-name></h2>
      <p>Leave your email and we will tell you the moment it arrives.</p>
      <form class="inline-form" data-form="notify" data-success="Thank you. You will be the first to know.">
        <input type="hidden" name="form" value="Notify Me">
        <input type="hidden" name="product" value="">
        <input type="hidden" name="shade" value="">
        <label class="sr-only" for="notify-email">Email address</label>
        <input id="notify-email" type="email" name="email" placeholder="Your email address" required autocomplete="email">
        <button class="btn btn--gold" type="submit">Notify Me</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>`;
    document.body.appendChild(dialog);

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-notify]');
      if (!btn) return;
      const p = products.find((x) => x.id === btn.dataset.notify);
      if (!p) return;
      const form = dialog.querySelector('form[data-form]');
      form.classList.remove('is-sent');
      form.querySelector('.form-status').textContent = '';
      const picked = btn.closest('.product-card')?.querySelector('.swatch[aria-pressed="true"]');
      const shade = picked ? picked.dataset.shade : '';
      form.elements.product.value = p.name;
      form.elements.shade.value = shade;
      dialog.querySelector('[data-notify-name]').textContent = shade ? `${p.name}, ${shade}` : p.name;
      dialog.showModal();
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
  initCarousels();
  fillContactDetails();
  bindForms();
  bindNotify();
  observeReveals();
})();
