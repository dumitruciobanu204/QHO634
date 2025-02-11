import axios from "axios";
import { config } from "../config/config.js";

export async function getWeatherByCoordinates(latitude, longitude) {
    try {
        const apiKey = config.openWeatherMapApiKey;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        return response.data;
    } catch (error) {
        console.error(`[ERROR]: Failed to fetch weather data - ${error.message}`);
        throw new Error("Failed to fetch weather data.");
    }
}

export async function getWeatherForecast(latitude, longitude) {
    try {
        const apiKey = config.openWeatherMapApiKey;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        const dailyForecasts = response.data.list
            .filter((entry) => entry.dt_txt.includes("12:00:00"))
            .slice(0, 5)
            .map((entry) => ({
                date: entry.dt_txt.split(" ")[0],
                temperature: Math.round(entry.main.temp),
                condition: entry.weather[0].description,
            }));

        return dailyForecasts;
    } catch (error) {
        console.error(`[ERROR]: Failed to fetch weather forecast - ${error.message}`);
        throw new Error("Failed to fetch weather forecast.");
    }
}
