import express from "express";
import { supabase } from "../lib/supabaseClient.js";

const router = express.Router();

/**
 * GET /api/profile/:id
 * Ambil profil user berdasarkan ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, phone, address, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("🔥 Error GET profile:", err);
    res.status(500).json({ message: "Gagal mengambil data profil", error: err.message });
  }
});

/**
 * PUT /api/profile/:id
 * Update data profil user
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phone, address } = req.body;

    // pastikan ada data yang mau diupdate
    if (!username && !phone && !address) {
      return res.status(400).json({ message: "Tidak ada data yang diubah" });
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ username, phone, address })
      .eq("id", id)
      .select("id, username, email, phone, address, created_at")
      .maybeSingle();

    if (error) throw error;
    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({ message: "Profil berhasil diperbarui", user: updatedUser });
  } catch (err) {
    console.error("🔥 Error PUT profile:", err);
    res.status(500).json({ message: "Gagal memperbarui profil", error: err.message });
  }
});

/**
 * DELETE /api/profile/:id
 * Hapus akun user dari database
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: deletedUser, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select("id, username, email")
      .maybeSingle();

    if (error) throw error;
    if (!deletedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      message: "Akun berhasil dihapus",
      deletedUser: { id: deletedUser.id, username: deletedUser.username },
    });
  } catch (err) {
    console.error("🔥 Error DELETE profile:", err);
    res.status(500).json({ message: "Gagal menghapus akun", error: err.message });
  }
});

export default router;
