import request from "supertest";
import app from "../app.js";

jest.unstable_mockModule("../services/plantService.js", () => ({
  identifyAndAssessPlant: jest.fn(() => Promise.resolve({
    plantName: "Mocked Aloe Vera",
    healthAssessment: [{ name: "Healthy", probability: "100%" }],
  })),
}));

const { identifyAndAssessPlant } = await import("../services/plantService.js");

describe("Plant Profiles API Tests", () => {
  it("should create a new plant profile", async () => {
    const res = await request(app).post("/api/plant-profiles").send({
      plantName: "Aloe Vera",
      plantImage: "base64_sample_image_data",
    });

    expect(identifyAndAssessPlant).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.profile).toHaveProperty("plantName", "Mocked Aloe Vera");
  });
});
