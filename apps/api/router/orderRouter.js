import express from "express"
import JwtUtil from "../utils/JwtUtil.js";
import { createOrder, deleteOrder, getOrdersByPayload, getOrdersByUserId, updateOrder } from "../controllers/orderController.js";


const router = express.Router()

// ---------Admin----------
router.get("/get", JwtUtil.checkToken, getOrdersByPayload);

router.put("/:id", JwtUtil.checkToken, updateOrder);

router.delete("/:id", JwtUtil.checkToken, deleteOrder);


// ---------Website----------
router.get("/:id", getOrdersByUserId);

router.post("/", createOrder);



export default router
