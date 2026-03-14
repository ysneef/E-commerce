import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductsByPayload,
  getProductsByPayloadClient,
  updateProduct,
} from "../controllers/productController.js";
import JwtUtil from "../utils/JwtUtil.js";

const router = express.Router();

// ---------Admin----------
router.get("/get", JwtUtil.checkToken, getProductsByPayload);

router.post("/", JwtUtil.checkToken, createProduct);

router.put("/:id", JwtUtil.checkToken, updateProduct);

router.delete("/:id", deleteProduct);

// ---------Website----------
router.get("/client/get", getProductsByPayloadClient);

router.get("/client/:id", getProductById);

export default router;
