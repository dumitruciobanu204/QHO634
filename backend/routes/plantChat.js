import express from "express";
import { handlePlantChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", handlePlantChat);

export default router;
