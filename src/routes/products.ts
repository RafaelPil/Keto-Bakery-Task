import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Add Original Product
router.post("/original", async (req, res) => {
  const { productCode, price } = req.body;
  try {
    const product = await prisma.originalProduct.create({
      data: { productCode, price },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// Add Modified Product
router.post("/modified", async (req, res) => {
  const { productCode, price } = req.body;
  try {
    const product = await prisma.modifiedProduct.create({
      data: { productCode, price },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// Get all Original Products
router.get("/original", async (req, res) => {
  try {
    const products = await prisma.originalProduct.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Get all Modified Products
router.get("/modified", async (req, res) => {
  try {
    const products = await prisma.modifiedProduct.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

export default router;
