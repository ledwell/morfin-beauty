// Floating "Design 1 / Design 2" switch for client review.
// Design 2 lives at the site root, Design 1 in /v1/. Remove this script (and the
// v1 folder) once a design is chosen.
(function () {
  'use strict';

  const inV1 = /\/v1\//.test(location.pathname);
  const file = location.pathname.split('/').pop() || 'index.html';
  const hash = location.hash;

  const links = [
    { label: 'Design 1', href: (inV1 ? '' : 'v1/') + file + hash, current: inV1 },
    { label: 'Design 2', href: (inV1 ? '../' : '') + file + hash, current: !inV1 },
  ];

  const bar = document.createElement('nav');
  bar.setAttribute('aria-label', 'Design options');
  bar.innerHTML = links
    .map((l) => `<a href="${l.href}"${l.current ? ' aria-current="true"' : ''}>${l.label}</a>`)
    .join('');

  const style = document.createElement('style');
  style.textContent = `
    .design-switch {
      position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 1000;
      display: flex; gap: 4px; padding: 4px;
      background: rgba(30, 12, 14, 0.88); border-radius: 999px;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
      font: 500 13px/1 system-ui, -apple-system, 'Segoe UI', sans-serif; letter-spacing: 0.02em;
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    }
    .design-switch a {
      color: #f5e6e0; text-decoration: none; padding: 9px 16px; border-radius: 999px; border: 0;
      white-space: nowrap;
    }
    .design-switch a:hover { color: #fff; background: rgba(255, 255, 255, 0.1); }
    .design-switch a[aria-current] { background: #fbf6f1; color: #4a0c16; }
  `;
  bar.className = 'design-switch';
  document.head.appendChild(style);
  document.body.appendChild(bar);
})();
