import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../data/users.json");

// GET profil (ambil data user pertama misalnya)
router.get("/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  const user = users.find((u) => u.id == req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT profil (update data user)
router.put("/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  const index = users.findIndex((u) => u.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "User not found" });

  // update data user
  users[index] = { ...users[index], ...req.body };

  // simpan ke file
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));

  res.json({ message: "Profil berhasil diperbarui", user: users[index] });
});

export default router;
