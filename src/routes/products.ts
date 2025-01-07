import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Generate random product data function
function generateRandomProducts(count: number) {
  const products: { productCode: string; price: number }[] = [];

  for (let i = 0; i < count; i++) {
    const productCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase(); // Random 6-character alphanumeric
    const price = parseFloat((Math.random() * 100).toFixed(2)); // Random price between 0 and 100
    products.push({ productCode, price });
  }
  return products;
}

// Add 50 random products Original Products with
router.post("/populate-original", async (req, res) => {
  try {
    const randomProducts = generateRandomProducts(50);
    const createdProducts = await prisma.originalProduct.createMany({
      data: randomProducts,
    });
    res.status(201).json({
      message:
        "Successfully populated Original Products table with 50 products.",
      count: createdProducts.count,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error populating Original Products table." });
  }
});

// Add Modified Products by keeping the code, but adjusting the price as 'price + VAT (21%)'
router.post("/modified", async (req, res) => {
  try {
    const originalProducts = await prisma.originalProduct.findMany();

    const modifiedProducts = originalProducts.map((product) => {
      // Applying 21% VAT
      const priceWithVat = parseFloat((product.price * 1.21).toFixed(2));
      return {
        productCode: product.productCode,
        price: priceWithVat,
      };
    });

    const createdModifiedProducts = await prisma.modifiedProduct.createMany({
      data: modifiedProducts,
    });

    res.status(201).json({
      message: `Successfully synced ${createdModifiedProducts.count} products to Modified Products.`,
      count: createdModifiedProducts.count,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error syncing products to Modified Products." });
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
