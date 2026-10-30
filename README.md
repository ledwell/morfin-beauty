# Morfin Beauty

Static website for Morfin Beauty. Plain HTML, CSS and JavaScript, with no build step. See `GLOSSARY.md` for brand terms.

## Preview locally

    npx serve .

Or open `index.html` directly in a browser.

## Deploy (Vercel)

Import the folder as a Vercel project with framework preset **Other** and no build command. `vercel.json` turns on clean URLs (`/shop` instead of `/shop.html`). `.vercelignore` keeps the large source images in `images/` out of the deploy.

## Things to replace before launch

| What | Where |
| --- | --- |
| Products (names, types, shades, prices, photos) | `assets/js/products.js`. Prices are placeholders. |
| Form endpoint for Inner Circle and Contact | `formEndpoint` in `assets/js/config.js`: create a free form at formspree.io and paste its URL. Until this is set, forms show their thank-you message but **nothing is sent**. |
| Email and social links | `assets/js/config.js` |
| Founder story and quotes | `founder.html` (marked `PLACEHOLDER`), plus the quote on `index.html` |
| Privacy Policy | `privacy.html`: have it reviewed |
| Logo | `assets/img/monogram.*`, `wordmark.*`, `logo-full.*` are cut out of `images/raw_logo.png`. Swap in a transparent PNG or SVG when available. |
| Social share image URL | `og:image` in each page's `<head>` is relative. Make it absolute (`https://yourdomain/assets/img/og-image.jpg`) once the domain exists. |

Product photos go in `assets/img/`. Tall, portrait shots on a dark or transparent background suit the cards best.

## Shopping (demo)

Each product has its own page (`product.html?id=<product id>`). Customers choose a shade and quantity and add to their bag (`bag.html`), which is kept in their own browser. `checkout.html` is a **demonstration only**: it collects no card details, sends nothing and charges nothing. When a payment provider is chosen, checkout will hand the bag to that provider instead. Demo shipping rates live in `shipping` in `assets/js/config.js`.

## Archived design

An alternative soft porcelain-and-blush design ("Design 2") was explored and set aside. It is preserved at the git tag `design-2-archive`; check it out with `git checkout design-2-archive`.
