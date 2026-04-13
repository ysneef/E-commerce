import express from "express";
import flashSaleController from "../controllers/flashSaleController.js";

const router = express.Router();

// GET active flash sale
router.get("/active", flashSaleController.getActiveFlashSale);

// Admin routes
router.get("/", flashSaleController.getAllFlashSales);
router.post("/", flashSaleController.createFlashSale);
router.put("/:id", flashSaleController.updateFlashSale);
router.delete("/:id", flashSaleController.deleteFlashSale);

export default router;
