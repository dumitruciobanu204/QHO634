import express from "express";
import { identifyPlant } from "../controllers/identifyController.js";

const router = express.Router();

router.post("/", identifyPlant);

export default router;
