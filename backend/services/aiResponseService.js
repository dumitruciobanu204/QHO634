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
    const previousMessages = chatDoc?.messages || [];
    const identifiedPlant = chatDoc?.identifiedPlants?.[0] || null;
    const lastBotMessage = previousMessages
        .filter(msg => msg.role === "assistant")
        .pop()?.content || "";

    // Simple greetings or nonsensical messages should return a natural response
    const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
    const isGreeting = greetings.includes(userMessage.toLowerCase().trim());

    if (isGreeting) {
        return "Hello! How can I assist you with your plant care today?";
    }

    let prompt = `You are an AI plant care assistant with expert-level knowledge of botany and environmental science. Your goal is to provide clear, real-time, and **fully adaptive** plant care advice that integrates:

### Data Context:
1. **Conversation History**: Ensure responses flow naturally and avoid repeating previous details.
2. **Plant Information**: If a plant is identified, provide targeted care recommendations.
3. **Weather & Environmental Factors**: Use all available data to enhance care recommendations, but only when relevant.
4. **Seasonal Adjustments**: Ensure advice aligns with the plant’s natural growth cycle.

### Key Guidelines:
- Ensure responses are **fluid, confident, and prescriptive**, rather than speculative.
- Avoid redundancy by considering previous AI responses and only introducing new insights.
- Provide **engaging and structured** responses while keeping them practical.
- If the user input is general (e.g., "hi", "hello"), respond naturally without forcing plant care advice.

### Conversation History:
${previousMessages.map(msg => `${msg.role}: ${msg.content}`).join("\n")}

### User Input:
"${userMessage}"

### Response Task:
- Generate a well-structured natural paragraph rather than using section headers (e.g., **Light Exposure**, **General Care Tips**). 
- Integrate all weather, seasonal, and plant-specific factors into **one fluid response**.
- Ensure **smooth transitions** between care recommendations instead of using bullet points or headings.
- The response should feel **conversational, clear, and informative**, just like a professional plant expert would explain it.
`;

    if (identifiedPlant) {
        const plantName = identifiedPlant.plantName || "the plant";
        const healthSummary = identifiedPlant.healthAssessment
            .slice(0, 2)
            .map(assessment => assessment.name)
            .join(" and ");

        if (!lastBotMessage.includes(plantName) || !lastBotMessage.includes(healthSummary)) {
            prompt += `

The user has identified their plant as ${plantName}. The plant is currently exhibiting signs of ${healthSummary}. Provide a precise, **weather-informed** care strategy that considers seasonal factors, upcoming temperature shifts, humidity fluctuations, and light exposure.`;
        }
    }

    if (weatherForecast && !isGreeting) {
        const weatherDetails = weatherForecast.map(day => {
            return `${day.date}: ${day.temperature}°C, ${day.condition}, humidity at ${day.humidity}%, cloud cover ${day.cloudPercentage}%, wind ${day.windSpeed} km/h.`;
        }).slice(0, 3).join(" ");

        if (!lastBotMessage.includes(weatherDetails)) {
            prompt += `

The upcoming weather forecast includes ${weatherDetails}. **Use this data to refine watering schedules, humidity control, light exposure, and general plant care recommendations dynamically.** Ensure that these environmental insights are directly integrated into practical advice rather than being listed separately.`;
        }
    }

    if (season) {
        if (!lastBotMessage.includes(season)) {
            prompt += `
    
    The current season is **${season}**. This means:
    - Plants may be in a dormancy period (depending on species).
    - Growth rates could be slower.
    - Light levels may be lower due to seasonal changes.
    - Indoor plants may require additional humidity and protection from cold drafts.
    - Outdoor plants may need winter protection, depending on their hardiness.
    
    Adjust all plant care strategies accordingly, ensuring recommendations align with **winter-specific challenges**.`;
        }    
    }

    try {
        return await gptQuery(prompt);
    } catch (error) {
        throw new Error("Failed to generate AI response.");
    }
}

export async function generatePlantProfileAIResponse(plantData, userMessage, weatherForecast = null, season = null) {
    const plantName = plantData.plantName?.toLowerCase().trim() || "this plant";
    const previousMessages = Array.isArray(plantData.messages) ? plantData.messages : [];
    const lastBotMessage = previousMessages
        .filter(msg => msg.role === "assistant")
        .pop()?.content || "";
        const userMessageLower = userMessage.toLowerCase();
        const plantNameLower = plantName.toLowerCase();

        const lastBotMessages = previousMessages
            .filter(msg => msg.role === "assistant")
            .slice(-3)
            .map(msg => msg.content.toLowerCase());

        const previouslyDiscussedTopics = new Set();
        lastBotMessages.forEach(message => {
            if (message.includes("watering")) previouslyDiscussedTopics.add("watering");
            if (message.includes("humidity")) previouslyDiscussedTopics.add("humidity");
            if (message.includes("temperature")) previouslyDiscussedTopics.add("temperature");
            if (message.includes("light")) previouslyDiscussedTopics.add("light");
            if (message.includes("fertilizer")) previouslyDiscussedTopics.add("fertilizer");
            if (message.includes("repotting")) previouslyDiscussedTopics.add("repotting");
        });

        const generalCareQuestions = [
            "how do i take care of my plant",
            "what should i do",
            "how do i fix this",
            "help",
            "advice",
            "care tips",
            "what do i do",
        ];

        const isGeneralPlantQuestion = generalCareQuestions.some(q => userMessageLower.includes(q));

        if (!userMessageLower.includes(plantNameLower) && !isGeneralPlantQuestion) {
            return `I can only provide care advice for **${plantName}**. If you need guidance on another plant, please create a separate plant profile.`;
        }

        let prompt = `You are an AI plant care assistant with expert-level knowledge of botany and environmental science. You will **only** provide advice for the user's plant: **${plantName}**.

        ### **Data Context:**
        1. **Avoid Repetition**: Ensure each response introduces new insights instead of repeating previous details.
        2. **Weather & Environmental Factors**: Always include relevant weather conditions in advice dynamically.
        3. **Seasonal Adjustments**: Adapt care recommendations to match seasonal cycles.

        ### **User Input:**
        "${userMessage}"

        ### **Response Task:**
        - **Avoid redundant phrasing** (e.g., if watering was already discussed, focus on new care aspects).
        - **Include the latest weather conditions** dynamically.
        - **Make smooth transitions between care advice topics.**
        - **If previous messages already addressed a point, provide new insights instead of repeating.**`;

        if (weatherForecast) {
            const weatherDetails = weatherForecast.map(day => {
                return `${day.date}: ${day.temperature}°C, ${day.condition}, humidity at ${day.humidity}%, wind ${day.windSpeed} km/h.`;
            }).slice(0, 3).join(" ");

            if (!lastBotMessages.some(msg => msg.includes(weatherDetails))) {
                prompt += `

        The upcoming weather forecast includes **${weatherDetails}**. Adjust care strategies accordingly, focusing on **watering schedules, humidity levels, and temperature shifts**.`;
            }
        }

        const possibleTopics = ["watering", "humidity", "temperature", "light", "fertilizer", "repotting"];
        const newTopics = possibleTopics.filter(topic => !previouslyDiscussedTopics.has(topic));

        if (newTopics.length > 0) {
            const topicToIntroduce = newTopics[0];
            prompt += `

        Since we haven’t covered **${topicToIntroduce}** yet, let's focus on that. Provide detailed advice about how **${topicToIntroduce}** affects ${plantName} and the best practices to optimize plant health.`;
        }

        try {
            return await gptQuery(prompt);
        } catch (error) {
            throw new Error("Failed to generate plant-specific AI response.");
        }



}