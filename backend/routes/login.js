import express from "express";

const router = express.Router();

// Simpan user di memori (RAM)
let users = [
  {
    id: 1,
    username: "demo",
    email: "demo@gmail.com",
    password: "12345", // bisa login dengan ini
  },
];

// Endpoint register (optional, biar bisa tambah user baru)
router.post("/register", (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📥 Register attempt:", { username, email });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

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
    console.log("✅ User baru:", newUser);

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error("🔥 Error register:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// Endpoint login
router.post("/", (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

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
