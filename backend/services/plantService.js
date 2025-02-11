import { db } from "../utils/firebase.js";
import axios from 'axios';
import { config } from '../config/config.js';

/**
 * Identify and assess a plant using Plant.id API.
 * @param {string} image - Base64 encoded image.
 * @returns {Promise<Object>} - Returns plant name and health assessment.
 */
export async function identifyAndAssessPlant(image) {
    try {
        const response = await axios.post('https://api.plant.id/v3/identification', {
            images: [image],
            health: 'all',
            datetime: new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00'),
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': config.plantIdApiKey,
            },
        });

        const result = response.data.result;
        const plantName = result?.classification?.suggestions?.[0]?.name || 'Unknown Plant';
        const healthAssessment = result?.disease?.suggestions?.map(d => ({
            name: d.name,
            probability: `${(d.probability * 100).toFixed(1)}%`,
            description: d.details?.language || 'No description available.',
        })) || [];

        return { plantName, healthAssessment };
    } catch (error) {
        console.error(`[PLANT ID ERROR]: ${error.message}`);
        throw new Error('Failed to identify plant or retrieve health assessment.');
    }
}

/**
 * Fetch a plant profile from Firestore.
 * @param {string} plantId - The ID of the plant.
 * @returns {Promise<Object>} - The plant profile data.
 */
export async function getPlantProfile(plantId) {
    try {
        const plantDoc = await db.collection("plant_profiles").doc(plantId).get();
        if (!plantDoc.exists) {
            throw new Error("Plant profile not found.");
        }
        return plantDoc.data();
    } catch (error) {
        console.error("[ERROR]: Failed to fetch plant profile", error);
        throw new Error("Failed to fetch plant profile.");
    }
}
