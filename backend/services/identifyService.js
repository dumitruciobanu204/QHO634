import axios from 'axios';
import { config } from '../config/config.js';

/**
 * @param {string} image
 * @returns {Object}
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
