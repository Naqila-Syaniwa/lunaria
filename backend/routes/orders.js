import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const __dirname = path.resolve();
const ordersFile = path.join(__dirname, "data", "orders.json");

// GET /api/orders/:userId - Ambil semua orders user
router.get("/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!fs.existsSync(ordersFile)) {
      return res.json([]);
    }

    const fileData = fs.readFileSync(ordersFile, "utf-8");
    const orders = JSON.parse(fileData || "[]");
    
    // Filter orders by userId
    const userOrders = orders.filter(order => Number(order.userId) === Number(userId));
    
    console.log(`📦 Orders fetched for user ${userId}:`, userOrders.length);
    res.json(userOrders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// POST /api/orders - Buat order baru
router.post("/", (req, res) => {
  try {
    const { userId, items, total, shippingAddress } = req.body;

    if (!userId || !items || !total) {
      return res.status(400).json({ message: "Data order tidak lengkap" });
    }

    let orders = [];
    if (fs.existsSync(ordersFile)) {
      const fileData = fs.readFileSync(ordersFile, "utf-8");
      orders = JSON.parse(fileData || "[]");
    }

    // Buat order baru
    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId: parseInt(userId),
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      total,
      items,
      shippingAddress: shippingAddress || 'Alamat belum diisi'
    };

    orders.push(newOrder);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    console.log("✅ Order created:", newOrder.id);
    res.status(201).json({ 
      message: "Order berhasil dibuat!", 
      order: newOrder 
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// PATCH /api/orders/:orderId - Update status order
router.patch("/:orderId", (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!fs.existsSync(ordersFile)) {
      return res.status(404).json({ message: "Belum ada order" });
    }

    const fileData = fs.readFileSync(ordersFile, "utf-8");
    let orders = JSON.parse(fileData || "[]");

    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    orders[orderIndex].status = status;
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    console.log(`✅ Order ${orderId} status updated to ${status}`);
    res.json({ 
      message: "Status order berhasil diupdate", 
      order: orders[orderIndex] 
    });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;