import { 
    fetchRemindersFromFirebase, 
    saveReminderToFirebase, 
    updateReminderStatus,
    fetchCompletedRemindersFromFirebase
} from "../services/plantReminderService.js";

export async function getPlantReminders(req, res) {
    try {
        const { plantId } = req.query;
        if (!plantId) {
            return res.status(400).json({ error: "Plant ID is required." });
        }

        const reminders = await fetchRemindersFromFirebase(plantId);
        res.status(200).json(reminders);
    } catch (error) {
        console.error("[ERROR]: Failed to fetch reminders", error);
        res.status(500).json({ error: "Failed to fetch reminders." });
    }
}

export async function createPlantReminder(req, res) {
    try {
        const { plantId, type, dueAt } = req.body;

        if (!plantId || !type || !dueAt) {
            return res.status(400).json({ error: "Plant ID, type, and due date are required." });
        }

        const newReminder = await saveReminderToFirebase({
            plantId,
            type,
            status: "pending",
            createdAt: new Date().toISOString(),
            dueAt
        });

        res.status(201).json({ message: "Reminder created successfully!", reminder: newReminder });
    } catch (error) {
        console.error("[ERROR]: Failed to create reminder", error);
        res.status(500).json({ error: "Failed to create reminder." });
    }
}

export async function markReminderAsCompleted(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Reminder ID is required." });
        }

        await updateReminderStatus(id, "completed");

        res.status(200).json({ message: "Reminder marked as completed." });
    } catch (error) {
        console.error("[ERROR]: Failed to update reminder", error);
        res.status(500).json({ error: "Failed to update reminder." });
    }
}

export async function getCompletedReminders(req, res) {
    try {
        const { plantId } = req.query;
        if (!plantId) {
            return res.status(400).json({ error: "Plant ID is required." });
        }

        const completedReminders = await fetchCompletedRemindersFromFirebase(plantId);
        res.status(200).json(completedReminders);
    } catch (error) {
        console.error("[ERROR]: Failed to fetch completed reminders", error);
        res.status(500).json({ error: "Failed to fetch completed reminders." });
    }
}
