import express from "express";
import { supabase } from "../lib/supabaseClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, email, password }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Akun berhasil dibuat!",
      user: { username: data.username, email: data.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mendaftar.", error: err.message });
  }
});

export default router;
