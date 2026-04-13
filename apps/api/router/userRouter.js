import express from "express";
import {
  addToCart,
  deleteUser,
  getUserByPayload,
  getUserProfile,
  loginUser,
  logoutUser,
  manageCartItem,
  registerUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import JwtUtil from "../utils/JwtUtil.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/cart", JwtUtil.checkToken, manageCartItem);

router.get("/me", JwtUtil.checkToken, getUserProfile);
router.get("/get", JwtUtil.checkToken, getUserByPayload);
router.put("/:id", JwtUtil.checkToken, updateUserProfile);
router.delete("/:id", JwtUtil.checkToken, deleteUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
