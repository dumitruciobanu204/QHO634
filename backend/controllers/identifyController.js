import { db } from "../utils/firebase.js";
import { identifyAndAssessPlant } from "../services/plantService.js"; // ✅ Correct import

export async function identifyPlant(req, res) {
    const { chatId, image, latitude, longitude } = req.body;

    if (!image) {
        return res.status(400).json({ error: "Image is required." });
    }

    try {
        const result = await identifyAndAssessPlant(image);
        console.log(`[DEBUG]: Plant Identified for Chat ${chatId}:`, result.plantName);

        const chatRef = db.collection("chats").doc(chatId);
        const chatDoc = await chatRef.get();

        let identifiedPlants = chatDoc.exists ? chatDoc.data().identifiedPlants || [] : [];

        const plantEntry = {
            plantName: result.plantName,
            healthAssessment: result.healthAssessment,
            timestamp: new Date().toISOString(),
        };
        identifiedPlants.push(plantEntry);
        await chatRef.set({ identifiedPlants }, { merge: true });

        console.log(`[DEBUG]: Stored plant identification in Firestore for chatId: ${chatId}`);

        res.json({
            chatId,
            plantName: result.plantName,
            healthAssessment: result.healthAssessment,
        });
    } catch (error) {
        console.error(`[ERROR]: Failed to identify plant - ${error.message}`);
        res.status(500).json({ error: "Failed to identify plant." });
    }
}
