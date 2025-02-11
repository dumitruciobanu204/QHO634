import { db } from "../utils/firebase.js";
import { getWeatherForecast } from "../services/weatherService.js";
import { identifyAndAssessPlant } from "../services/identifyService.js";
import { generateAIResponse } from "../services/aiResponseService.js";
import { chatWithPlantAI } from "../services/plantProfileService.js";
import admin from "firebase-admin";

export async function createNewChat(req, res) {
    try {
        const chatId = `chat_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await db.collection("chats").doc(chatId).set({
            messages: [],
            identifiedPlants: [],
            userPreferences: {
                indoorPreference: null,
                wateringFrequency: null,
            },
            plantLocation: null,
            recentWeather: null,
        });
        res.json({ chatId });
    } catch (error) {
        console.error(`[ERROR]: Failed to create chat - ${error.message}`);
        res.status(500).json({ error: "Failed to create chat session." });
    }
}

export async function handleImageUpload(req, res) {
    const { chatId, image, latitude, longitude } = req.body;

    if (!chatId || !image) {
        return res.status(400).json({ error: "chatId and image are required." });
    }

    try {
        const plantData = await identifyAndAssessPlant(image);
        let weatherForecast = null;

        if (latitude && longitude) {
            weatherForecast = await getWeatherForecast(latitude, longitude);
        }

        const chatRef = db.collection("chats").doc(chatId);
        await chatRef.update({
            identifiedPlants: admin.firestore.FieldValue.arrayUnion({
                plantName: plantData.plantName,
                healthAssessment: plantData.healthAssessment,
                timestamp: new Date().toISOString(),
            }),
            recentWeather: { forecast: weatherForecast },
        });

        const aiResponse = await generateAIResponse(
            {
                identifiedPlants: [plantData],
                recentWeather: { forecast: weatherForecast },
            },
            "Uploaded an image of a plant. Provide advice.",
            weatherForecast
        );

        await chatRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(
                { role: "user", content: "Uploaded an image" },
                { role: "assistant", content: aiResponse }
            ),
        });

        res.json({ reply: aiResponse });
    } catch (error) {
        console.error(`[ERROR]: Failed to process image - ${error.message}`);
        res.status(500).json({ error: "Failed to process image." });
    }
}

export async function handleMessage(req, res) {
    const { chatId, message, latitude, longitude } = req.body;

    if (!chatId || !message) {
        return res.status(400).json({ error: "chatId and message are required." });
    }

    try {
        const chatRef = db.collection("chats").doc(chatId);
        let chatDoc = await chatRef.get();

        let weatherForecast = null;
        if (latitude && longitude) {
            weatherForecast = await getWeatherForecast(latitude, longitude);
        }

        let messages = chatDoc.exists ? chatDoc.data().messages || [] : [];

        const userMessage = { role: "user", content: message };
        messages.push(userMessage);
        await chatRef.update({ messages, recentWeather: { forecast: weatherForecast } });

        chatDoc = await chatRef.get();
        const chatData = chatDoc.data();

        const aiResponse = await generateAIResponse(chatData, message, weatherForecast);

        const botMessage = { role: "assistant", content: aiResponse };
        messages.push(botMessage);
        await chatRef.update({ messages });

        res.json({ reply: aiResponse });
    } catch (error) {
        console.error(`[ERROR]: Failed to handle message - ${error.message}`);
        res.status(500).json({ error: "Failed to process message." });
    }
}

export async function handlePlantChat(req, res) {
    const { plantId, message } = req.body;

    if (!plantId || !message) {
        return res.status(400).json({ error: "Plant ID and message are required." });
    }

    try {
        const response = await chatWithPlantAI(plantId, message);
        res.json(response);
    } catch (error) {
        console.error("[ERROR]: Failed to process plant chat message", error);
        res.status(500).json({ error: "Failed to process message." });
    }
}
