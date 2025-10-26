import express from "express";
import { supabase } from "../lib/supabaseClient.js";

const router = express.Router();

// ✅ LOGIN USER
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", { email });

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Password salah" });
    }

    console.log("✅ Login berhasil:", user);

    res.status(200).json({
      message: "Login berhasil!",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("🔥 Error login:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
