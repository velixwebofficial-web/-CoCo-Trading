# CoCo Trading — Full Online Store + Admin Panel

A complete e-commerce site (socks, underwear, bras) with real pricing, a working
shopping cart & checkout, and an admin panel that manages products and receives
every order live — no fake/placeholder data anywhere in the admin panel.

## What's new in this version

### Fixed: "Add Product" wasn't publishing
The real cause: `admin/js/admin.js` had a leftover demo script that attached a
click handler to **every button whose text contained the word "save"** and called
`e.preventDefault()` on it. Since the Add/Edit Product button is labelled
**"Save Product"**, this silently blocked the form from ever submitting — the
product was never sent to the server. This has been removed; saving now works
correctly everywhere (products, order status, settings).

### Real store, not just a catalogue
- Every product now has a **price** (JD) and optional **stock quantity**, set from
  the admin panel.
- The public site has a real **shopping cart** (bag icon, top right of every page):
  add products, adjust quantity, remove items — persists in the browser between visits.
- A full **checkout form** (name, phone, email, address, city, notes) sends the order
  straight to the server. Prices are always recalculated server-side from the live
  product list, so nothing can be tampered with from the browser.
- Out-of-stock products show "Out of Stock" and can't be added to the cart.

### Admin panel — 100% real data, nothing fake
- **Dashboard**: total products, total orders, total customers, and total revenue are
  all computed live from real data. Latest Orders and Recent Customers are real.
- **Orders**: every order placed on the public site appears here immediately. View full
  order details (customer info, items, total), update status (Pending → Processing →
  Shipping → Completed / Cancelled), and export all orders to CSV.
- **Customers**: built automatically from real order history (no manual entry needed) —
  name, contact info, number of orders, total spent, last order date.
- **Products**: add/edit/delete with image, category, price, stock, description, MOQ,
  lead time, packaging, and shipping notes.

## Requirements
- [Node.js](https://nodejs.org) 18 or newer.

## Run it locally
```bash
npm install
npm start
```
Then open:
- `http://localhost:3000` — the public website (browse, add to cart, checkout)
- `http://localhost:3000/admin/index.html` — the admin panel

Default admin login (change this after first login, from **Settings → Security**):
- Username: `admin`
- Password: `CoCo@Admin2026`

**Important:** the site must be run with this Node.js server (`npm start`) — it will
not work correctly if you just double-click the HTML files or upload them to a plain
static host, since the cart, orders, and admin panel all depend on the server API.

## Project structure
- `index.html`, `products.html`, `about.html`, `contact.html`, `product-details.html`, `404.html` — public pages
- `css/style.css`, `js/script.js`, `js/i18n.js`, `js/products-public.js`, `js/cart.js` — public site styling & behavior
- `admin/` — admin panel (HTML pages, `admin/css/admin.css`, `admin/js/*.js`)
- `server/server.js` — Express server: serves the site and exposes the product/order/admin API
- `data/products.json` — product data (created automatically)
- `data/orders.json` — real customer orders (created automatically)
- `data/admin.json` — admin credentials, hashed (created automatically on first run)
- `assets/products/` — uploaded product images

## Deploying
This site needs a Node.js host to run (e.g. Render, Railway, a VPS) since products,
orders, and customers are stored server-side and shared by everyone — it will not work
as plain static files on something like GitHub Pages. Set the `PORT` environment
variable if your host requires it.

## Still a to-do
- The contact form validates in the browser but isn't yet wired to a real email/backend
  service, and the Messages admin page still shows placeholder content — say the word
  and this can be connected next (e.g. save messages to the server, or forward to email/WhatsApp).
- Currency is shown as JD (Jordanian Dinar) throughout — easy to change if you sell in
  a different currency.
