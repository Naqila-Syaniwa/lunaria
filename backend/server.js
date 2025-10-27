import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv"; // ⬅️ tambahkan ini

// ⬇️ Load file .env (pastikan file .env ada di folder backend)
dotenv.config();

// Import semua route
import flowersRoute from "./routes/flowers.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import profileRoute from "./routes/profile.js";
import cartRoute from "./routes/cart.js";
import ordersRoute from "./routes/orders.js";

const app = express();

// Konfigurasi CORS hanya untuk domain frontend Anda
const corsOptions = {
  origin: 'https://lunaria-ebon.vercel.app',
  optionsSuccessStatus: 200 // Untuk beberapa browser lama
};

// Gunakan middleware
app.use(cors(corsOptions)); // ✅ Ini adalah satu-satunya panggilan cors yang Anda butuhkan
app.use(express.json());    // Middleware untuk membaca JSON body

// Routes utama
app.use("/api/flowers", flowersRoute);
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/profile", profileRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", ordersRoute);

// Root route sederhana
app.get("/", (req, res) => {
  res.send("🌸 Backend server is running smoothly on Vercel!");
});

// 🧩 Ini penting untuk Vercel (Serverless Function)
export const handler = serverless(app);

// Default export juga tetap dibutuhkan agar Express tetap bisa dijalankan secara lokal
export default app;