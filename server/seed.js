// Creates the default admin account (only if one doesn't exist yet).
// Run with: npm run seed
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_DIR = path.join(__dirname, "..", "data");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "CoCo@Admin2026";

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

if (fs.existsSync(ADMIN_FILE)) {
  console.log("Admin account already exists at data/admin.json — skipping seed.");
  process.exit(0);
}

const passwordHash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

fs.writeFileSync(
  ADMIN_FILE,
  JSON.stringify({ username: DEFAULT_USERNAME, passwordHash }, null, 2)
);

console.log("Default admin account created:");
console.log("  Username:", DEFAULT_USERNAME);
console.log("  Password:", DEFAULT_PASSWORD);
console.log("Please log in and change this password from the admin Settings page.");
