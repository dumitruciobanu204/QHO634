import { db } from "../utils/firebase.js";

export async function fetchRemindersFromFirebase(plantId) {
    try {
        const snapshot = await db.collection("plant_reminders")
            .where("plantId", "==", plantId)
            .where("status", "in", ["pending", "overdue"])
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("[ERROR]: Failed to fetch reminders from Firestore", error);
        throw new Error("Failed to fetch reminders.");
    }
}

export async function saveReminderToFirebase(reminderData) {
    try {
        const reminderRef = await db.collection("plant_reminders").add(reminderData);
        return { id: reminderRef.id, ...reminderData };
    } catch (error) {
        console.error("[ERROR]: Failed to save reminder to Firestore", error);
        throw new Error("Failed to save reminder.");
    }
}

export async function updateReminderStatus(reminderId, status) {
    try {
        await db.collection("plant_reminders").doc(reminderId).update({
            status,
            completedAt: status === "completed" ? new Date().toISOString() : null
        });
    } catch (error) {
        console.error("[ERROR]: Failed to update reminder status", error);
        throw new Error("Failed to update reminder.");
    }
}

export async function fetchCompletedRemindersFromFirebase(plantId) {
    try {
        const snapshot = await db.collection("plant_reminders")
            .where("plantId", "==", plantId)
            .where("status", "==", "completed")
            .orderBy("completedAt", "desc")
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("[ERROR]: Failed to fetch completed reminders from Firestore", error);
        throw new Error("Failed to fetch completed reminders.");
    }
}
