import express from "express";
import { supabase } from "../lib/supabaseClient.js";

const router = express.Router();

// 🟢 GET /api/orders/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// 🟢 POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { userId, items, total, shippingAddress } = req.body;

    if (!userId || !items || !total) {
      return res.status(400).json({ message: "Data order tidak lengkap" });
    }

    // 🔹 Buat ID unik seperti ORD-2024-001
    const orderId = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;

    const newOrder = {
      id: orderId,
      user_id: userId,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      total,
      items,
      shipping_address: shippingAddress || "Alamat belum diisi",
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([newOrder])
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Order created:", orderId);
    res.status(201).json({
      message: "Order berhasil dibuat!",
      order: data,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// 🟢 PATCH /api/orders/:orderId
router.patch("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

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
    console.error("❌ Error updating order:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
