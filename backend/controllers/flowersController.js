import fs from "fs";

const DATA_PATH = "./data/flowers.json";

export const getAllFlowers = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error reading flowers data." });
  }
};

export const getFlowerById = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH));
    const flower = data.find(f => f.id === parseInt(req.params.id));
    if (!flower) return res.status(404).json({ message: "Flower not found" });
    res.json(flower);
  } catch (err) {
    res.status(500).json({ message: "Error reading flowers data." });
  }
};

export const addFlower = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH));
    const newFlower = { id: Date.now(), ...req.body };
    data.push(newFlower);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(newFlower);
  } catch (err) {
    res.status(500).json({ message: "Error saving new flower." });
  }
};
