import OpenAI from "openai";
import { config } from "../config/config.js";

const openai = new OpenAI({ apiKey: config.openaiApiKey });

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function gptQuery(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an AI plant assistant. Your responses must be highly context-aware, using the full chat history to provide helpful and relevant plant care advice." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error(`[ERROR]: OpenAI failed - ${error.message}`);
        throw error;
    }
}
