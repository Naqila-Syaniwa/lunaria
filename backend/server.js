import express from "express";
import cors from "cors";
import flowersRoute from "./routes/flowers.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import profileRoute from "./routes/profile.js";
import cartRoute from "./routes/cart.js";
import ordersRoute from "./routes/orders.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/flowers", flowersRoute);
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/profile", profileRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", ordersRoute);

// Default route
app.get("/", (req, res) => {
  res.send("Backend server is running smoothly!");
});

export default app;
