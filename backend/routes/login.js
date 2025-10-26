import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Path ke file users.json
const usersFile = path.join(process.cwd(), "data", "users.json");

// Fungsi bantu: baca data user dari file
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Gagal baca users.json:", err);
    return [];
  }
};

// Fungsi bantu: simpan data user ke file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("❌ Gagal menulis users.json:", err);
  }
};

// ✅ REGISTER
router.post("/register", (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📥 Register attempt:", { username, email });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    let users = readUsers();
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
    };

    users.push(newUser);
    writeUsers(users); // Simpan ke file JSON

    console.log("✅ User baru disimpan:", newUser);

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error("🔥 Error register:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ✅ LOGIN
router.post("/", (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const users = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Password salah" });
    }

    const { password: _, ...userWithoutPassword } = user;
    console.log("✅ Login berhasil:", userWithoutPassword);

    res.status(200).json({
      message: "Login berhasil!",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("🔥 Error login:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
