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
| Products (names, descriptions, prices, photos) | `assets/js/products.js` |
| Form endpoint for Inner Circle, Notify Me and Contact | `formEndpoint` in `assets/js/config.js`: create a free form at formspree.io and paste its URL. Until this is set, forms show their thank-you message but **nothing is sent**. |
| Email and social links | `assets/js/config.js` |
| Founder story and quotes | `founder.html` (marked `PLACEHOLDER`), plus the quote on `index.html` |
| Privacy Policy | `privacy.html`: have it reviewed |
| Logo | `assets/img/monogram.*`, `wordmark.*`, `logo-full.*` are cut out of `images/raw_logo.png`. Swap in a transparent PNG or SVG when available. |
| Social share image URL | `og:image` in each page's `<head>` is relative. Make it absolute (`https://yourdomain/assets/img/og-image.jpg`) once the domain exists. |

Product photos go in `assets/img/`. Tall, portrait shots on a dark or transparent background suit the cards best.

## Archived design

An alternative soft porcelain-and-blush design ("Design 2") was explored and set aside. It is preserved at the git tag `design-2-archive`; check it out with `git checkout design-2-archive`.
