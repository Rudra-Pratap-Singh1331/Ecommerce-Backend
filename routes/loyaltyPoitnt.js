import express from "express";
import Carts from "../model/CartModel.js"; // or "../model" based on location

const router = express.Router();

router.get("/loyalty", async (req, res) => {
  try {
    const userEmail = "rudra@example.com";

    const cart = await Carts.findOne({ userEmail });
    const loyaltyPoints = cart?.loyaltyPoints || 0;

    res.status(200).json({ loyaltyPoints });
  } catch (err) {

    res.status(500).json({ message: "Failed to fetch loyalty points" });
  }
});

export default router;
