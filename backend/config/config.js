import dotenv from 'dotenv';

dotenv.config();

export const config = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    plantIdApiKey: process.env.PLANTID_API_KEY,
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    openWeatherMapApiKey: process.env.OPENWEATHERMAP_API_KEY,
};
