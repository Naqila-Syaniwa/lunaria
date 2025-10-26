import express from "express";
import {
  getAllFlowers,
  getFlowerById,
  addFlower
} from "../controllers/flowersController.js";

const router = express.Router();

router.get("/", getAllFlowers);
router.get("/:id", getFlowerById);
router.post("/", addFlower);

export default router;
