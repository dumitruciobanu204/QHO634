import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "../iris-fb074-firebase-adminsdk-fbsvc-a163c5d0d4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
});

export const db = admin.firestore();

// console.log("[DEBUG]: Firebase initialized");
