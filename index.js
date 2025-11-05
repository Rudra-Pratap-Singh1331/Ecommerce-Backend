import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

// Route Imports
import productRoute from "./routes/productRoute.js";
import showProductRoute from "./routes/showProductRoute.js";
import soldRoute from "./routes/soldRoute.js";
import dashBoardRoute from "./routes/dashboardRoutes.js";
import lowStock from "./routes/lowStock.js";
import gemini from "./routes/gemini.js";
import restock from "./routes/restockProduct.js";
import fillProductRoute from "./routes/fillProduct.js";
import cartRoute from "./routes/cartRoutes.js";
import prodDetails from "./routes/detailsProd.js";
import loyaltyPoints from "./routes/loyaltyPoitnt.js";
import category from "./routes/category.js";
import geminiResponse from "./gemini.js";
import geminifinal from "./routes/geminiFinal.js";
import searchRoute from "./routes/SearchRoute.js";
import userRoutes from "./routes/loyality_update.js";
import authRoutes from "./routes/authRoutes.js";
import purchasedRoute from "./routes/purchased.js";
import ingredient from "./routes/ingredient.js";

dotenv.config();
const app = express();

// ✅ Use middlewares
app.use(
  cors({
    origin: [
      "https://retailer-dashboardai.vercel.app",
      "https://customerai-theta.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://customerai-theta.vercel.app",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join-cart", (cartId) => {
    socket.join(cartId);
  });

  socket.on("cart-update", ({ cartId, updatedCart }) => {
    io.to(cartId).emit("receive-cart", updatedCart);
  });

  socket.on("join-collaboration", (cartId) => {
    socket.join(cartId);
  });

  socket.on("leave-collaboration", (cartId) => {
    socket.leave(cartId);
  });

  socket.on("loyalty-used", ({ cartId, useLoyalty }) => {
    io.to(cartId).emit("loyalty-used", useLoyalty);
  });

  socket.on("disconnect", () => {});
});

app.use("/api/gemini", gemini);
app.use("/api/dashboard", dashBoardRoute);
app.use("/api/products", lowStock);
app.use("/api/sold", soldRoute);
app.use("/api/product", productRoute);
app.use("/api/showproducts", showProductRoute);
app.use("/api/restockproducts", restock);
app.use("/api/ai", fillProductRoute);
app.use("/api/cart", cartRoute);
app.use("/api/products", prodDetails);
app.use("/api", loyaltyPoints);
app.use("/api/products", category);
app.use("/api/search", searchRoute);
app.use("/api/auth", authRoutes);
app.use("/api/sales", purchasedRoute);
app.use("/api/users", userRoutes);
app.use("/api/ai", ingredient);

app.get("/", async (req, res) => {
  const prompt = req.query.prompt;
  const data = await geminiResponse(prompt);
  res.json(data);
});
app.use("/api/ai", geminifinal);

const Port = process.env.PORT || 5000;
server.listen(Port, () => {
  connectDb();
});
