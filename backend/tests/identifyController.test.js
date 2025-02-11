import request from "supertest";
import app from "../app.js";

jest.unstable_mockModule("../services/plantService.js", () => ({
  identifyAndAssessPlant: jest.fn(() => Promise.resolve({
    plantName: "Mocked Aloe Vera",
    healthAssessment: [{ name: "Healthy", probability: "100%" }],
  })),
}));

const { identifyAndAssessPlant } = await import("../services/plantService.js");

describe("Identify API Tests", () => {
  it("should return plant identification data (mocked)", async () => {
    const res = await request(app).post("/identify").send({
      chatId: "testChat123",
      image: "base64_sample_image_data",
    });

    expect(identifyAndAssessPlant).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("plantName", "Mocked Aloe Vera");
    expect(res.body).toHaveProperty("healthAssessment");
  });
});
