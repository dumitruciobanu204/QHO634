import { generateAIResponse } from "../services/aiResponseService.js";

describe("AI Response Service Tests", () => {
  it("should generate an AI response (mocked)", async () => {
    const response = await generateAIResponse(
      {
        identifiedPlants: [{ plantName: "Aloe Vera", healthAssessment: [] }],
        recentWeather: { forecast: [] },
      },
      "How do I care for my plant?"
    );

    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  });
});
