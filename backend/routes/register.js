import express from "express";

const router = express.Router();
let users = []; // disimpan di RAM (hilang kalau restart)

router.post("/", (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📥 Data diterima:", { username, email, password });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const newUser = { id: Date.now(), username, email, password };
    users.push(newUser);

    console.log("✅ User baru disimpan:", newUser);
    res.status(201).json({ message: "Registrasi berhasil!", user: newUser });
  } catch (error) {
    console.error("🔥 Error detail:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
