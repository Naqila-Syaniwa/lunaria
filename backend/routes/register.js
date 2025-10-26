import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const __dirname = path.resolve();
const dataFile = path.join(__dirname, "data", "users.json");

// POST /api/register
router.post("/", (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📥 Data diterima:", { username, email, password });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Baca data lama
    let users = [];
    if (fs.existsSync(dataFile)) {
      const fileData = fs.readFileSync(dataFile, "utf-8");
      users = JSON.parse(fileData || "[]");
    }

    // Cek email duplikat
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Simpan user baru
    const newUser = { id: Date.now(), username, email, password };
    users.push(newUser);
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));

    console.log("✅ Data baru disimpan:", newUser);
    res.status(201).json({ message: "Registrasi berhasil!", user: newUser });
  } catch (error) {
    console.error("🔥 Error detail:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
