import express from "express";
import { handleStreamWebhook } from "../controllers/ai.controller.js";

const router = express.Router();

// Stream will send POST requests here
router.post("/webhook", handleStreamWebhook);

export default router;
