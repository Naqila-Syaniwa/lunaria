import express from "express";
import cors from "cors";
import registerRoute from "./routes/register.js";
import profileRoute from "./routes/profile.js";
import loginRoutes from "./routes/login.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route
app.use("/api/register", registerRoute);
app.use("/api/profile", profileRoute);
app.use("/api/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
