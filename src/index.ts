import express from "express";
import productRoutes from "./routes/products.ts";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
