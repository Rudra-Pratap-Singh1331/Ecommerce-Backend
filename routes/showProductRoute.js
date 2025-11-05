// routes/productRoutes.js
import express from "express";
import showProducts from "../controller/showProductController.js";

const showProductRoute = express.Router();


showProductRoute.get("/show", showProducts);

export default showProductRoute;
