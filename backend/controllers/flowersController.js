import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gunakan path absolut agar aman di server Vercel
const DATA_PATH = path.join(__dirname, "../data/flowers.json");

export const getAllFlowers = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading flowers data:", err);
    res.status(500).json({ message: "Error reading flowers data." });
  }
};

export const getFlowerById = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    const flower = data.find(f => f.id === parseInt(req.params.id));
    if (!flower) return res.status(404).json({ message: "Flower not found" });
    res.json(flower);
  } catch (err) {
    res.status(500).json({ message: "Error reading flowers data." });
  }
};

export const addFlower = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    const newFlower = { id: Date.now(), ...req.body };
    data.push(newFlower);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(newFlower);
  } catch (err) {
    res.status(500).json({ message: "Error saving new flower." });
  }
};
