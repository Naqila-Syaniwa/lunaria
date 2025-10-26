import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const __dirname = path.resolve();
const dataFile = path.join(__dirname, "data", "carts.json");

// Ambil cart user
router.get("/:email", (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(400).json({ message: "Email diperlukan" });

  let carts = {};
  if (fs.existsSync(dataFile)) {
    carts = JSON.parse(fs.readFileSync(dataFile, "utf-8") || "{}");
  }

  res.json(carts[email] || []);
});

// Simpan cart user
router.post("/:email", (req, res) => {
  const email = req.params.email;
  const { cart } = req.body;

  if (!email || !cart)
    return res.status(400).json({ message: "Email dan cart wajib diisi" });

  let carts = {};
  if (fs.existsSync(dataFile)) {
    carts = JSON.parse(fs.readFileSync(dataFile, "utf-8") || "{}");
  }

  carts[email] = cart;
  fs.writeFileSync(dataFile, JSON.stringify(carts, null, 2));

  res.json({ message: "Cart berhasil disimpan!" });
});

export default router;
