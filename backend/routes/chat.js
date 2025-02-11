import express from "express";
import { createNewChat, handleMessage, handleImageUpload } from "../controllers/chatController.js";

const router = express.Router();

router.post("/new", createNewChat);
router.post("/", handleMessage);
router.post("/image", handleImageUpload);

export default router;
