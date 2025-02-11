import { db } from "../utils/firebase.js";
import admin from "firebase-admin";
import { identifyAndAssessPlant } from "../services/plantService.js";
import { getWeatherByCoordinates, getWeatherForecast } from "../services/weatherService.js";
import { generateAIResponse } from "../services/aiResponseService.js";
import { generatePlantProfileAIResponse } from "../services/aiResponseService.js";

export async function saveProfileToFirebase(profileData) {
    try {
        const { plantImage, latitude, longitude, preferences, weatherAlerts } = profileData;

        if (!plantImage) {
            throw new Error("Plant image is required.");
        }

        // Identify the plant
        const plantData = await identifyAndAssessPlant(plantImage);

        // Fetch weather data
        let weatherForecast = null;
        if (latitude && longitude) {
            weatherForecast = await getWeatherForecast(latitude, longitude);
        }

        // Ensure healthAssessment exists
        plantData.healthAssessment = plantData.healthAssessment || [];

        // Generate AI response (Personalized Plant Care Advice)
        const initialAdvice = await generateAIResponse(
            { identifiedPlants: [plantData], recentWeather: { forecast: weatherForecast } },
            "Provide a detailed and personalized plant care guide based on the current weather and conditions."
        );

        // Save to Firestore (Using a messages map)
        const profileRef = await db.collection("plant_profiles").add({
            plantName: plantData.plantName,
            preferences: preferences || "",
            weatherAlerts: weatherAlerts !== undefined ? weatherAlerts : true,
            plantImage,
            createdAt: new Date().toISOString(),
            messages: {
                initialAdvice: initialAdvice, // Store AI-generated message inside a map
            },
            healthAssessment: plantData.healthAssessment, // ✅ Ensure healthAssessment is saved
        });

        return {
            id: profileRef.id,
            plantName: plantData.plantName,
            messages: {
                initialAdvice: initialAdvice,
            },
            healthAssessment: plantData.healthAssessment, // ✅ Return this to frontend
        };
    } catch (error) {
        console.error("[ERROR]: Failed to save plant profile", error);
        throw new Error("Failed to save plant profile.");
    }
}

export async function getProfileFromFirebase(plantId) {
    try {
        const plantDoc = await db.collection("plant_profiles").doc(plantId).get();
        if (!plantDoc.exists) {
            return null;
        }
        return plantDoc.data();
    } catch (error) {
        console.error("[ERROR]: Failed to fetch plant profile from Firestore", error);
        throw new Error("Failed to fetch plant profile.");
    }
}

export async function chatWithPlantAI(plantId, userMessage) {
    try {
        const plantRef = db.collection("plant_profiles").doc(plantId);
        const plantDoc = await plantRef.get();

        if (!plantDoc.exists) {
            throw new Error("Plant profile not found.");
        }

        const plantData = plantDoc.data();

        const aiResponse = await generatePlantProfileAIResponse(plantData, userMessage);

        // ✅ Store messages in Firestore
        const userMessageEntry = { role: "user", content: userMessage, timestamp: new Date().toISOString() };
        const aiMessageEntry = { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() };

        await plantRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(userMessageEntry, aiMessageEntry),
        });

        return { reply: aiResponse };
    } catch (error) {
        console.error("[ERROR]: Failed to chat with AI for plant", error);
        throw new Error("Failed to generate plant-specific response.");
    }
}

export async function deleteProfileFromFirebase(plantId) {
    try {
        await db.collection("plant_profiles").doc(plantId).delete();
    } catch (error) {
        console.error("[ERROR]: Failed to delete plant profile", error);
        throw new Error("Failed to delete plant profile.");
    }
}

export async function getAllProfilesFromFirebase() {
    try {
        const snapshot = await db.collection("plant_profiles").orderBy("createdAt", "desc").get();

        if (snapshot.empty) return [];

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("[ERROR]: Failed to fetch plant profiles", error);
        throw new Error("Failed to fetch plant profiles.");
    }
}
