import express from "express";
import { sendChatMessage } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", sendChatMessage);

export default router;
