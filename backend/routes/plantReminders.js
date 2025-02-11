import express from "express";
import {
    getPlantReminders,
    createPlantReminder,
    markReminderAsCompleted,
    getCompletedReminders
} from "../controllers/plantReminderController.js";

const router = express.Router();

router.get("/", getPlantReminders);

router.post("/", createPlantReminder);

router.patch("/:id", markReminderAsCompleted);

router.get("/history", getCompletedReminders);

export default router;
