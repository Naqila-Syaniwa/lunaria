import express from "express";
import { supabase } from "../lib/supabaseClient.js";

const router = express.Router();

// ✅ REGISTER USER BARU
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📥 Register attempt:", { username, email });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // 🔍 Cek apakah email sudah terdaftar
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // 🆕 Simpan user baru
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, email, password }])
      .select()
      .single();

    if (error) throw error;

    console.log("✅ User baru disimpan:", data);

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: { id: data.id, username: data.username, email: data.email },
    });
  } catch (error) {
    console.error("🔥 Error register:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
