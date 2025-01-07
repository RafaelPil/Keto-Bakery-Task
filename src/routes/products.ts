import express, { Request, Response } from "express";
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
router.post("/populate-original", async (req: Request, res: Response) => {
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
// sync endpoint should have a parameter that specifies minimum price of the products to sync, 0 being all
// If any price is modified of a product in Original Products table and trigger sync, the price re-calculates and updates in Modified Products table
router.post("/sync-to-modified", async (req: Request, res: Response) => {
  const minPrice = parseFloat(req.query.minPrice as string) || 0; // Get minPrice from query parameter

  try {
    const originalProducts = await prisma.originalProduct.findMany({
      where: {
        price: {
          gte: minPrice, // Filter products with price greater than or equal to minPrice
        },
      },
    });

    // Process each original product
    for (const product of originalProducts) {
      // Applying 21% VAT to the price
      const priceWithVat = parseFloat((product.price * 1.21).toFixed(2));

      // Check if the product already exists in Modified Products
      const existingModifiedProduct = await prisma.modifiedProduct.findUnique({
        where: { id: product.id, productCode: product.productCode },
      });

      if (existingModifiedProduct) {
        // If it exists, update the price with the new price
        await prisma.modifiedProduct.update({
          where: { id: product.id, productCode: product.productCode },
          data: { price: priceWithVat },
        });
      } else {
        // If it doesn't exist, create a new record in Modified Products
        await prisma.modifiedProduct.create({
          data: {
            productCode: product.productCode,
            price: priceWithVat,
          },
        });
      }
    }

    // Validation for minPrice
    if (minPrice < 0) {
      return res.status(400).json({
        message: "Invalid minPrice value. It must be a positive number.",
      });
    }

    // Check if any products were found
    if (originalProducts.length === 0) {
      return res.status(404).json({
        message: `No products found matching the price criteria.`,
      });
    }

    // If everything is good, return a success response
    return res.status(201).json({
      message: `Successfully synced and updated prices for modified products.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error syncing and updating products to Modified Products.",
    });
  }
});

// Get all Original Products
router.get("/original", async (req: Request, res: Response) => {
  try {
    const products = await prisma.originalProduct.findMany();

    if (products.length === 0) {
      res.status(200).json({ message: "No products found" });
    } else {
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Get all Modified Products
router.get("/modified", async (req: Request, res: Response) => {
  try {
    const products = await prisma.modifiedProduct.findMany();

    if (products.length === 0) {
      res.status(200).json({ message: "No products found" });
    } else {
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

export default router;
