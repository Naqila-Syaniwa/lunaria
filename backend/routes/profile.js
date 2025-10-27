import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../data/users.json");

// Helper untuk baca file user
const readUsers = () => JSON.parse(fs.readFileSync(dataFile, "utf8"));

// Helper untuk tulis file user
const writeUsers = (users) =>
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));

/**
 * GET /api/profile/:id
 * Ambil profil user berdasarkan ID
 */
router.get("/:id", (req, res) => {
  try {
    const users = readUsers();
    const user = users.find((u) => u.id == req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error reading users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PUT /api/profile/:id
 * Update profil user
 */
router.put("/:id", (req, res) => {
  try {
    const users = readUsers();
    const index = users.findIndex((u) => u.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[index] = { ...users[index], ...req.body };
    writeUsers(users);

    res.json({ message: "Profil berhasil diperbarui", user: users[index] });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * DELETE /api/profile/:id
 * Hapus akun user
 */
router.delete("/:id", (req, res) => {
  try {
    const users = readUsers();
    const index = users.findIndex((u) => u.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = users.splice(index, 1)[0];
    writeUsers(users);

    res.json({
      message: "Akun berhasil dihapus",
      deletedUser: { id: deletedUser.id, username: deletedUser.username },
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;