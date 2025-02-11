import request from "supertest";
import app from "../app.js";
import { db } from "../utils/firebase.js";

describe("Chat API Tests", () => {
  it("should create a new chat session", async () => {
    const res = await request(app).post("/chat/new");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("chatId");
  });

  it("should process a user message", async () => {
    const chatSession = await request(app).post("/chat/new");
    const chatId = chatSession.body.chatId;

    const res = await request(app).post("/chat").send({
      chatId,
      message: "How do I care for my plant?",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reply");
  }, 10000);
});

afterAll(async () => {
  await db.terminate(); 
});
