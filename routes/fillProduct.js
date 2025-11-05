import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ✅ No options object — just pass the key directly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/fill-product", async (req, res) => {
  const { text } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ correct model name for v1
    });

    const prompt = `
You are an AI that fills product forms in JSON format.
The user will speak a description of the product.

Instruction:
Based on this speech: "${text}", return only a valid JSON object, strictly matching:

{
  "name": "Product name as string",
  "imgurl": "A placeholder image URL or relevant one if mentioned",
  "price": "Numeric price value (no ₹ symbol)",
  "quantity": "Numeric stock quantity",
  "costprice": "Numeric cost price",
  "description": "One-line product description"
}

Respond with only pure JSON — no markdown, no text, no explanation.
`;

    const result = await model.generateContent(prompt);

    const raw = result.response.text();
    

    let output;
    try {
      output = JSON.parse(raw);
    } catch {
      return res.status(400).json({ error: "Invalid JSON", output: raw });
    }

    res.json({ output });
  } catch (err) {
  
    res.status(500).json({ error: err.message });
  }
});

export default router;
