import { gptQuery } from "./openaiService.js";
import { chatWithPlantAI } from "../services/plantProfileService.js";

/**
 * @param {Object} chatDoc
 * @param {string} userMessage
 * @param {Object|null} weatherForecast
 * @param {string|null} season
 * @returns {Promise<string>}
 */
export async function generateAIResponse(chatDoc, userMessage, weatherForecast, season) {
    // console.log("[DEBUG]: Generating response for chat document:", chatDoc);

    const previousMessages = chatDoc?.messages || [];
    const identifiedPlant = chatDoc?.identifiedPlants?.[0] || null;

    let prompt = `You are an AI plant care assistant. Use the provided context to generate a concise, natural, and context-aware response.
### Data Context:
1. **Conversation History**: You have access to the user's previous messages and assistant responses.
2. **Plant Information**: If a plant has been identified, include its name, health status, and relevant care advice.
3. **Weather Data**: If available, integrate weather conditions into your care recommendations.
4. **Seasonal Context**: Tailor advice to the current season to match the plant's lifecycle.

### Instructions:
- Format responses as natural, flowing paragraphs rather than using bullet points.
- Avoid repeating previous details unless clarification is necessary.
- Provide relevant, concise advice based on the plant’s needs and current weather conditions.
- End with an engaging follow-up question or an offer to assist further.

### Conversation History:
${previousMessages.map(msg => `${msg.role}: ${msg.content}`).join("\n")}

### Task:
Respond to the latest user input (${userMessage}) by referencing the context above.`;

    if (identifiedPlant) {
        const plantName = identifiedPlant.plantName || "the plant";
        const healthSummary = identifiedPlant.healthAssessment
            .slice(0, 2)
            .map(assessment => assessment.name)
            .join(" and ");

        prompt += `

The user has identified their plant as ${plantName}. It is showing signs of ${healthSummary}, which are common during this stage. Provide a natural, flowing explanation of the plant's current state, mentioning whether this condition is normal or if specific action is needed. Include care recommendations based on the plant's lifecycle, weather conditions, and season, ensuring clarity and conciseness.`;
    }

    if (weatherForecast) {
        prompt += `

The upcoming weather forecast includes ${weatherForecast
            .map(day => `${day.date} with ${day.condition} and ${day.temperature}°C`)
            .slice(0, 3)
            .join(", ")}. Ensure the response accounts for temperature, humidity, and light levels in plant care recommendations.`;
    }

    if (season) {
        prompt += `

The current season is ${season}, which may influence plant growth and care requirements. Tailor your response to reflect seasonal adjustments in watering, fertilizing, and light exposure.`;
    }

    // console.log("[DEBUG]: Final Prompt Sent to AI:\n", prompt);

    try {
        return await gptQuery(prompt);
    } catch (error) {
        // console.error(`[ERROR]: AI response generation failed - ${error.message}`);
        throw new Error("Failed to generate AI response.");
    }
}


export async function generatePlantProfileAIResponse(plantData, userMessage, weatherForecast = null, season = null) {
    let prompt = `You are a dedicated AI assistant for a user's specific plant. You will only respond about this plant, using the data provided below.`;

    if (plantData) {
        prompt += `
        The user is asking about their plant: **${plantData.plantName}**.

        Details about this plant:
        - Preferences: ${plantData.preferences || "No specific preferences provided."}
        - Weather Alerts Enabled: ${plantData.weatherAlerts ? "Yes" : "No"}

        **Important:** Your response should **only** be about this plant. Do not provide information about any other plant types.`;

        if (weatherForecast) {
            prompt += `

            The current weather forecast for the plant’s location includes:
            ${weatherForecast.map(day => `${day.date} - ${day.condition}, ${day.temperature}°C`).join("\n")}
            
            Adjust care recommendations accordingly.`;
        }

        if (season) {
            prompt += `
            The current season is ${season}. Make sure recommendations are **season-appropriate**.`;
        }
    }

    prompt += `

    **User's Question:** "${userMessage}"
    Provide an expert, structured response that is clear and strictly relevant to this plant.`;

    try {
        return await gptQuery(prompt);
    } catch (error) {
        throw new Error("Failed to generate plant-specific AI response.");
    }
}
