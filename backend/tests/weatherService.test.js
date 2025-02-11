import { getWeatherByCoordinates, getWeatherForecast } from "../services/weatherService.js";

describe("Weather Service Tests", () => {
  it("should fetch current weather data (mocked)", async () => {
    const weatherData = await getWeatherByCoordinates(51.5074, -0.1278);

    expect(weatherData).toHaveProperty("weather");
    expect(weatherData).toHaveProperty("main");
  });

  it("should fetch weather forecast (mocked)", async () => {
    const forecastData = await getWeatherForecast(51.5074, -0.1278);

    expect(Array.isArray(forecastData)).toBe(true);
    expect(forecastData.length).toBeGreaterThan(0);
    expect(forecastData[0]).toHaveProperty("date");
    expect(forecastData[0]).toHaveProperty("temperature");
  });
});
