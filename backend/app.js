import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";
import identifyRoutes from "./routes/identify.js";
import plantProfilesRoutes from "./routes/plantProfiles.js";
import plantRemindersRoutes from "./routes/plantReminders.js";
import plantChatRoutes from "./routes/plantChat.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, "../frontend")));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

app.use("/chat", chatRoutes);
app.use("/identify", identifyRoutes);
app.use("/api/plant-profiles", plantProfilesRoutes);
app.use("/api/plant-reminders", plantRemindersRoutes);
app.use("/api/plant-chat", plantChatRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error(`[SERVER ERROR]: ${err.message}`);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;



import axios from "axios";

export async function identifyAndAssessPlant(imageData) {
  const response = await axios.post("https://api.plant.id/v3/identify", {
    images: [imageData],
    api_key: process.env.PLANT_ID_API_KEY,
  });
  return response.data;
}
