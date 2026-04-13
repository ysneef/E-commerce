import express from "express";
import { createCheckoutSession, verifySession } from "../controllers/stripeController.js";

const stripeRouter = express.Router();

stripeRouter.post("/create-checkout-session", createCheckoutSession);
stripeRouter.get("/verify-session", verifySession);

export default stripeRouter;
