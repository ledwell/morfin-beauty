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
      <div class="announcement">The Lip Collection is almost here. <a href="#inner-circle">Join the list</a> for first access.</div>
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="brand" href="index.html" aria-label="Morfin Beauty home">
            <img class="brand__mark" src="assets/img/monogram-red.png" alt="" width="300" height="226">
            <span class="brand__name">Morfin Beauty</span>
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
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
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
          <section class="inner-circle" id="inner-circle" aria-labelledby="inner-circle-title">
            <div>
              <h2 id="inner-circle-title">Join the Inner Circle</h2>
              <p>Launch dates, new shades and the occasional note from Mary. No spam, ever.</p>
            </div>
            <form class="inline-form" data-form="inner-circle">
              <input type="hidden" name="form" value="Inner Circle">
              <label class="sr-only" for="ic-email">Email address</label>
              <input id="ic-email" type="email" name="email" placeholder="Your email address" required autocomplete="email">
              <button class="btn btn--light" type="submit">Sign up</button>
              <p class="form-status" role="status" aria-live="polite"></p>
            </form>
          </section>

          <div class="footer-grid">
            <div class="footer-brand">
              <img src="assets/img/monogram-cream.png" alt="" width="300" height="226" loading="lazy">
              <p>Morfin Beauty. Luxury lips, lasting impression.</p>
            </div>
            <nav aria-label="Footer">
              <h3 class="footer-title">Explore</h3>
              <ul>
                ${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
              </ul>
            </nav>
            <div>
              <h3 class="footer-title">Shop</h3>
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
            <p>&copy; ${year} Morfin Beauty</p>
            <p><a href="privacy.html">Privacy Policy</a></p>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- Products ---------- */

  // Line drawings for products that have no photograph yet.
  const ART = {
    perfume: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <rect x="48" y="10" width="24" height="22" rx="3"/><rect x="54" y="32" width="12" height="10"/>
      <path d="M30 42h60l8 18v80a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10V60z"/><path d="M34 66h52"/></svg>`,
    'perfume-round': `<svg viewBox="0 0 120 160" aria-hidden="true">
      <path d="M50 14h20v18H50z"/><path d="M46 32h28v10H46z"/><circle cx="60" cy="98" r="50"/></svg>`,
    foundation: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <rect x="44" y="12" width="32" height="34" rx="4"/><path d="M50 46h20v8H50z"/>
      <rect x="30" y="54" width="60" height="96" rx="8"/><path d="M30 76h60"/></svg>`,
    compact: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <ellipse cx="60" cy="58" rx="46" ry="14"/><path d="M14 58v8c0 8 20 14 46 14s46-6 46-14v-8"/>
      <ellipse cx="60" cy="110" rx="46" ry="14"/><path d="M14 110v10c0 8 20 14 46 14s46-6 46-14v-10"/></svg>`,
    highlighter: `<svg viewBox="0 0 120 160" aria-hidden="true">
      <rect x="18" y="40" width="84" height="84" rx="12"/><rect x="30" y="52" width="60" height="60" rx="8"/></svg>`,
  };

  function collectionById(id) {
    return collections.find((c) => c.id === id) || { short: id, name: id };
  }

  function productCard(p) {
    const col = collectionById(p.collection);
    const media = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="product-card__art">${ART[p.art] || ART.perfume}<span>Coming soon</span></div>`;
    return `
      <article class="product-card" data-collection="${esc(p.collection)}">
        <div class="product-card__media${p.image ? '' : ' is-placeholder'}">${media}</div>
        <p class="product-card__collection">${esc(col.short)}</p>
        <h3 class="product-card__name">${esc(p.name)}</h3>
        <p class="product-card__desc">${esc(p.description)}</p>
        <div class="product-card__foot">
          <span class="product-card__price">${p.price ? esc(p.price) : 'Price TBA'}</span>
          <button class="notify-link" type="button" data-notify="${esc(p.id)}">Notify me</button>
        </div>
      </article>`;
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

    function apply(id) {
      if (!tabs.some((t) => t.id === id)) id = 'all';
      const list = id === 'all' ? products : products.filter((p) => p.collection === id);
      grid.innerHTML = list.map(productCard).join('');
      filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
      const col = collections.find((c) => c.id === id);
      heading.textContent = col ? col.name : 'Shop all';
      blurb.textContent = col ? col.blurb : 'Lip, fragrance and face. Prices and launch dates are coming soon.';
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
      status.textContent = form.dataset.success || "Thank you, you're on the list.";
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
      <p class="label">Notify me</p>
      <h2 data-notify-name></h2>
      <p>Leave your email and we'll let you know as soon as it's available.</p>
      <form class="inline-form" data-form="notify" data-success="Thank you. We'll email you when it arrives.">
        <input type="hidden" name="form" value="Notify Me">
        <input type="hidden" name="product" value="">
        <label class="sr-only" for="notify-email">Email address</label>
        <input id="notify-email" type="email" name="email" placeholder="Your email address" required autocomplete="email">
        <button class="btn btn--primary" type="submit">Notify me</button>
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
      form.elements.product.value = p.name;
      dialog.querySelector('[data-notify-name]').textContent = p.name;
      dialog.showModal();
    });
  }

  /* ---------- Contact details ---------- */

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

  renderHeader();
  renderFooter();
  renderFeatured();
  renderShop();
  fillContactDetails();
  bindForms();
  bindNotify();
})();
