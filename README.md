# CoCo Trading — Wholesale Website + Working Admin Panel

A responsive wholesale catalogue site (socks, underwear, bras) with a real,
functional admin panel for managing the products shown on the public site.

## What's new in this version
- A small Node.js/Express backend now powers the admin panel and the product catalogue.
- **Real admin login** (hashed password, session-protected pages) instead of a decorative form.
- **Working product management**: add / edit / delete products with an image, category,
  description, MOQ, lead time, packaging, and shipping notes — no price/stock fields,
  since this is a wholesale showcase, not a checkout store.
- Products marked **Active** appear automatically on the public site for every visitor,
  using the exact same visual design already built (category cards, product detail layout).
- If a category has no admin-added products yet, the original default content still shows,
  so the site never looks empty or broken.
- Fixed pre-existing bugs: a missing/misnamed admin products page, a duplicated
  `admin/orders.html` document, and sidebar links that didn't actually navigate.

## Requirements
- [Node.js](https://nodejs.org) 18 or newer.

## Run it locally
```bash
npm install
npm start
```
Then open:
- `http://localhost:3000` — the public website
- `http://localhost:3000/admin/index.html` — the admin panel

Default admin login (change this after first login, from **Settings → Security**):
- Username: `admin`
- Password: `CoCo@Admin2026`

## Project structure
- `index.html`, `products.html`, `about.html`, `contact.html`, `product-details.html`, `404.html` — public pages
- `css/style.css`, `js/script.js`, `js/i18n.js`, `js/products-public.js` — public site styling & behavior
- `admin/` — admin panel (HTML pages, `admin/css/admin.css`, `admin/js/*.js`)
- `server/server.js` — Express server: serves the site and exposes the admin/product API
- `data/products.json` — product data (created automatically)
- `data/admin.json` — admin credentials, hashed (created automatically on first run)
- `assets/products/` — uploaded product images

## Deploying
This site now needs a Node.js host to run (e.g. Render, Railway, a VPS) since products are
stored server-side and shared by all visitors — it will no longer work as plain static files
on something like GitHub Pages. Set the `PORT` environment variable if your host requires it.

## Still a to-do (unchanged from the original project)
The contact form validates in the browser but isn't yet wired to a real email/backend service.
