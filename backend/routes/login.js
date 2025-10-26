import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const __dirname = path.resolve();
const dataFile = path.join(__dirname, "data", "users.json");

// POST /api/login
router.post("/", (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    // Baca data users
    if (!fs.existsSync(dataFile)) {
      return res.status(404).json({ message: "Belum ada user terdaftar" });
    }

    const fileData = fs.readFileSync(dataFile, "utf-8");
    const users = JSON.parse(fileData || "[]");

    // Cari user berdasarkan email
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    // Cek password (dalam production pakai bcrypt!)
    if (user.password !== password) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Login berhasil - jangan kirim password
    const { password: _, ...userWithoutPassword } = user;
    
    console.log("✅ Login berhasil:", userWithoutPassword);
    res.status(200).json({ 
      message: "Login berhasil!", 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error("🔥 Error detail:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;