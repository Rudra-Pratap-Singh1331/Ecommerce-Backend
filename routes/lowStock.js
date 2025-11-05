import express from "express";
import Product from "../model/productModel.js"; // adjust path if needed

const lowStock = express.Router();


lowStock.get("/low-stock", async (req, res) => {
  try {
    const threshold = 2; 
    const lowStockProducts = await Product.find({ quantity: { $lte: threshold } })
      .lean()
      .sort({ quantity: 1 }); 

    res.status(200).json(lowStockProducts);
  } catch (err) {
    console.error("Low stock fetch error:", err);
    res.status(500).json({ message: "Failed to fetch low stock products" });
  }
});

export default lowStock;
