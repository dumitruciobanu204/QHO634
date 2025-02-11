import express from "express";
import { 
    getPlantProfiles, 
    savePlantProfile, 
    deletePlantProfile,
    getPlantProfile
    // addPlantAlert, 
    // getPlantAlerts, 
    // completePlantAlert, 
    // deletePlantAlert 
} from "../controllers/plantProfileController.js";

const router = express.Router();

// Plant profile routes
router.get("/", getPlantProfiles);
router.post("/", savePlantProfile);
router.delete("/:plantId", deletePlantProfile);

router.get("/:plantId", getPlantProfile);

// Alert routes
// router.post("/:plantId/alerts", addPlantAlert);
// router.get("/:plantId/alerts", getPlantAlerts);
// router.patch("/:plantId/alerts/:alertId", completePlantAlert);
// router.delete("/:plantId/alerts/:alertId", deletePlantAlert);

export default router;
