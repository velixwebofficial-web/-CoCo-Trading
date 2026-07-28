const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");
const UPLOAD_DIR = path.join(ROOT, "assets", "products");

const ORDER_STATUSES = ["pending", "processing", "shipping", "completed", "cancelled"];

const CATEGORIES = [
  { slug: "mens-underwear", en: "Men's Underwear" },
  { slug: "womens-underwear", en: "Women's Underwear" },
  { slug: "womens-socks", en: "Women's Socks" },
  { slug: "mens-socks", en: "Men's Socks" },
  { slug: "bras", en: "Bras" },
  { slug: "boys-socks", en: "Boys' Socks" },
  { slug: "girls-socks", en: "Girls' Socks" },
];

// ---- bootstrap data files ----
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, "[]");
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]");
if (!fs.existsSync(ADMIN_FILE)) {
  const defaultHash = bcrypt.hashSync("CoCo@Admin2026", 10);
  fs.writeFileSync(
    ADMIN_FILE,
    JSON.stringify({ username: "admin", passwordHash: defaultHash }, null, 2)
  );
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---- app setup ----
const app = express();
app.use(express.json());
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    name: "coco.sid",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 },
  })
);

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

// ---- image upload ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${safeExt}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, PNG, or WEBP images are allowed"));
  },
});

// =====================================================
// ADMIN AUTH
// =====================================================
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  const admin = readJSON(ADMIN_FILE);
  const validUser = username === admin.username;
  const validPass = validUser && bcrypt.compareSync(password, admin.passwordHash);
  if (!validUser || !validPass) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  req.session.isAdmin = true;
  req.session.username = admin.username;
  res.json({ ok: true, username: admin.username });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/admin/check", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  res.status(401).json({ authenticated: false });
});

app.post("/api/admin/change-password", requireAuth, (req, res) => {
  const { newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  const admin = readJSON(ADMIN_FILE);
  admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  writeJSON(ADMIN_FILE, admin);
  res.json({ ok: true });
});

// =====================================================
// CATEGORIES (fixed list, used by the public site design)
// =====================================================
app.get("/api/categories", (req, res) => res.json(CATEGORIES));

// =====================================================
// PRODUCTS
// =====================================================

// Public: list products (optionally filtered by category), only "active" ones
app.get("/api/products", (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const { category, all } = req.query;
  let list = products;
  if (!all) list = list.filter((p) => p.status !== "inactive");
  if (category) list = list.filter((p) => p.category === category);
  res.json(list);
});

// Public: get single product
app.get("/api/products/:id", (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const product = products.find((p) => String(p.id) === String(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Admin: full list including inactive (kept for symmetry; use ?all=1 above)
app.get("/api/admin/products", requireAuth, (req, res) => {
  res.json(readJSON(PRODUCTS_FILE));
});

// Admin: create product
app.post("/api/admin/products", requireAuth, upload.single("image"), (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const { name, category, description, price, stock, moq, leadTime, packaging, shipping, status } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
  }
  if (!CATEGORIES.some((c) => c.slug === category)) {
    return res.status(400).json({ error: "Unknown category" });
  }
  const priceNum = Number(price);
  if (price === undefined || price === "" || Number.isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: "A valid price is required" });
  }
  const stockNum = stock === undefined || stock === "" ? null : Number(stock);
  if (stockNum !== null && (Number.isNaN(stockNum) || stockNum < 0)) {
    return res.status(400).json({ error: "Stock must be a valid number" });
  }
  const image = req.file
    ? `assets/products/${req.file.filename}`
    : `assets/optimized/categories/${category}.webp`;

  const newProduct = {
    id: Date.now(),
    name,
    category,
    description: description || "",
    image,
    price: Math.round(priceNum * 100) / 100,
    stock: stockNum,
    moq: moq || "By quotation",
    leadTime: leadTime || "By order",
    packaging: packaging || "Standard / Custom",
    shipping: shipping || "Worldwide",
    status: status === "inactive" ? "inactive" : "active",
    createdAt: new Date().toISOString(),
  };
  products.unshift(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

// Admin: update product
app.put("/api/admin/products/:id", requireAuth, upload.single("image"), (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const idx = products.findIndex((p) => String(p.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const { name, category, description, price, stock, moq, leadTime, packaging, shipping, status } = req.body;
  if (category && !CATEGORIES.some((c) => c.slug === category)) {
    return res.status(400).json({ error: "Unknown category" });
  }

  const existing = products[idx];

  let priceValue = existing.price;
  if (price !== undefined && price !== "") {
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: "A valid price is required" });
    }
    priceValue = Math.round(priceNum * 100) / 100;
  }

  let stockValue = existing.stock;
  if (stock !== undefined) {
    if (stock === "") {
      stockValue = null;
    } else {
      const stockNum = Number(stock);
      if (Number.isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ error: "Stock must be a valid number" });
      }
      stockValue = stockNum;
    }
  }

  const updated = {
    ...existing,
    name: name ?? existing.name,
    category: category ?? existing.category,
    description: description ?? existing.description,
    price: priceValue,
    stock: stockValue,
    moq: moq ?? existing.moq,
    leadTime: leadTime ?? existing.leadTime,
    packaging: packaging ?? existing.packaging,
    shipping: shipping ?? existing.shipping,
    status: status ? (status === "inactive" ? "inactive" : "active") : existing.status,
    image: req.file ? `assets/products/${req.file.filename}` : existing.image,
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  writeJSON(PRODUCTS_FILE, products);
  res.json(updated);
});

// Admin: delete product
app.delete("/api/admin/products/:id", requireAuth, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const idx = products.findIndex((p) => String(p.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  const [removed] = products.splice(idx, 1);
  writeJSON(PRODUCTS_FILE, products);
  // best-effort cleanup of uploaded file (never delete shared category defaults)
  if (removed.image && removed.image.startsWith("assets/products/")) {
    const filePath = path.join(ROOT, removed.image);
    fs.unlink(filePath, () => {});
  }
  res.json({ ok: true });
});

// =====================================================
// ORDERS
// =====================================================

// Public: place a new order. Prices are always taken from the server's
// product records (never trusted from the client) so totals can't be faked.
app.post("/api/orders", (req, res) => {
  const body = req.body || {};
  const customer = body.customer || {};
  const items = Array.isArray(body.items) ? body.items : [];

  const name = (customer.name || "").trim();
  const phone = (customer.phone || "").trim();
  const address = (customer.address || "").trim();
  const city = (customer.city || "").trim();

  if (!name || !phone || !address) {
    return res.status(400).json({ error: "Name, phone, and address are required" });
  }
  if (items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty" });
  }

  const products = readJSON(PRODUCTS_FILE);
  const orderItems = [];

  for (const raw of items) {
    const product = products.find((p) => String(p.id) === String(raw.productId));
    if (!product || product.status === "inactive") {
      return res.status(400).json({ error: `Product ${raw.productId} is no longer available` });
    }
    const qty = Math.max(1, Math.floor(Number(raw.qty) || 1));
    orderItems.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      price: product.price ?? 0,
      qty,
      lineTotal: Math.round((product.price ?? 0) * qty * 100) / 100,
    });
  }

  const total = Math.round(orderItems.reduce((sum, it) => sum + it.lineTotal, 0) * 100) / 100;

  const orders = readJSON(ORDERS_FILE);
  const newOrder = {
    id: Date.now(),
    status: "pending",
    customer: {
      name,
      phone,
      email: (customer.email || "").trim(),
      address,
      city,
      country: (customer.country || "").trim() || "Jordan",
      notes: (customer.notes || "").trim(),
    },
    items: orderItems,
    total,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  writeJSON(ORDERS_FILE, orders);
  res.status(201).json(newOrder);
});

// Admin: list all orders
app.get("/api/admin/orders", requireAuth, (req, res) => {
  res.json(readJSON(ORDERS_FILE));
});

// Admin: get one order
app.get("/api/admin/orders/:id", requireAuth, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const order = orders.find((o) => String(o.id) === String(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Admin: update order status
app.put("/api/admin/orders/:id", requireAuth, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const idx = orders.findIndex((o) => String(o.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Order not found" });

  const { status } = req.body || {};
  if (!status || !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  writeJSON(ORDERS_FILE, orders);
  res.json(orders[idx]);
});

// Admin: delete an order
app.delete("/api/admin/orders/:id", requireAuth, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const idx = orders.findIndex((o) => String(o.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Order not found" });
  orders.splice(idx, 1);
  writeJSON(ORDERS_FILE, orders);
  res.json({ ok: true });
});

// =====================================================
// CUSTOMERS (derived from real orders — no fake data)
// =====================================================
app.get("/api/admin/customers", requireAuth, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const byPhone = new Map();
  for (const order of orders) {
    const key = order.customer.phone || order.customer.email || order.customer.name;
    if (!byPhone.has(key)) {
      byPhone.set(key, {
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        city: order.customer.city,
        country: order.customer.country,
        ordersCount: 0,
        totalSpent: 0,
        lastOrderAt: order.createdAt,
      });
    }
    const c = byPhone.get(key);
    c.ordersCount += 1;
    c.totalSpent = Math.round((c.totalSpent + order.total) * 100) / 100;
    if (new Date(order.createdAt) > new Date(c.lastOrderAt)) c.lastOrderAt = order.createdAt;
  }
  res.json(Array.from(byPhone.values()).sort((a, b) => new Date(b.lastOrderAt) - new Date(a.lastOrderAt)));
});

// =====================================================
// DASHBOARD STATS (all real, computed from live data)
// =====================================================
app.get("/api/admin/stats", requireAuth, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const orders = readJSON(ORDERS_FILE);

  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = Math.round(activeOrders.reduce((sum, o) => sum + o.total, 0) * 100) / 100;

  const customersMap = new Map();
  for (const order of orders) {
    const key = order.customer.phone || order.customer.email || order.customer.name;
    customersMap.set(key, true);
  }

  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  res.json({
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status !== "inactive").length,
    totalOrders: orders.length,
    pendingOrders,
    totalCustomers: customersMap.size,
    totalRevenue,
    latestOrders: orders.slice(0, 5),
  });
});

// =====================================================
// STATIC FILES
// =====================================================

// Guard every admin page except the login page itself.
app.get(/^\/admin\/(?!index\.html$|css\/|js\/).+\.html$/, (req, res, next) => {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect("/admin/index.html");
});

app.use(express.static(ROOT));

app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT, "404.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CoCo Trading site running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/index.html`);
});
