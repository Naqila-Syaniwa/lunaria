import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataFile = path.join(process.cwd(), "data", "users.json");

// 🔹 Fungsi bantu: baca user dari file
function readUsers() {
  try {
    if (!fs.existsSync(dataFile)) return [];
    const data = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("❌ Gagal membaca users.json:", error);
    return [];
  }
}

// 🔹 Fungsi bantu: tulis user ke file
function writeUsers(users) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("❌ Gagal menulis users.json:", error);
  }
}

// ✅ POST /api/register
router.post("/", (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📥 Data diterima:", { username, email });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const users = readUsers();

    // 🔍 Cek email duplikat
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // 🆕 Buat user baru
    const newUser = {
      id: Date.now(),
      username,
      email,
      password, // (optional: nanti bisa ganti pakai bcrypt)
    };

    users.push(newUser);
    writeUsers(users); // Simpan ke file JSON

    console.log("✅ User baru disimpan:", newUser);

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: { id: newUser.id, username, email },
    });
  } catch (error) {
    console.error("🔥 Error register:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
