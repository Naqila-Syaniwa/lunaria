import express from "express";
import { supabase } from "../lib/supabaseClient.js";

const router = express.Router();

// 🔹 GET /api/orders/:userId → ambil semua order milik user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validasi
    if (!userId) {
      return res.status(400).json({ message: "User ID tidak ditemukan" });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// 🔹 POST /api/orders → buat order baru
router.post("/", async (req, res) => {
  try {
    const { userId, items, total, shippingAddress } = req.body;

    if (!userId || !items?.length || !total) {
      return res.status(400).json({ message: "Data order tidak lengkap" });
    }

    // 🔸 Jika alamat tidak dikirim dari frontend, ambil dari tabel users
    let finalAddress = shippingAddress;
    if (!finalAddress) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("address")
        .eq("id", userId)
        .maybeSingle();

      if (userError) throw userError;
      finalAddress = userData?.address || "Alamat belum diisi";
    }

    // Buat ID unik: ORD-2025-001234
    const orderId = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const newOrder = {
      id: orderId,
      user_id: userId,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      total: Number(total),
      items,
      shipping_address: finalAddress, // ✅ sudah terisi otomatis
      created_at: new Date().toISOString(),
    };

    console.log("🧾 Inserting order:", newOrder);

    const { data, error } = await supabase
      .from("orders")
      .insert([newOrder])
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Order created:", data.id);
    res.status(201).json({
      message: "Order berhasil dibuat!",
      order: data,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// 🔹 PATCH /api/orders/:orderId → update status order
router.patch("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status harus diisi" });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Status order berhasil diupdate",
      order: data,
    });
  } catch (error) {
    console.error("❌ Error updating order:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
