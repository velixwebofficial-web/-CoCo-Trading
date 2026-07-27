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
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");
const UPLOAD_DIR = path.join(ROOT, "assets", "products");

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
  const { name, category, description, moq, leadTime, packaging, shipping, status } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
  }
  if (!CATEGORIES.some((c) => c.slug === category)) {
    return res.status(400).json({ error: "Unknown category" });
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

  const { name, category, description, moq, leadTime, packaging, shipping, status } = req.body;
  if (category && !CATEGORIES.some((c) => c.slug === category)) {
    return res.status(400).json({ error: "Unknown category" });
  }

  const existing = products[idx];
  const updated = {
    ...existing,
    name: name ?? existing.name,
    category: category ?? existing.category,
    description: description ?? existing.description,
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
