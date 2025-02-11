import { 
    getAllProfilesFromFirebase,
    saveProfileToFirebase,
    deleteProfileFromFirebase,
    getProfileFromFirebase
} from "../services/plantProfileService.js";

export async function getPlantProfiles(req, res) {
    try {
        const profiles = await getAllProfilesFromFirebase();
        res.status(200).json(profiles);
    } catch (error) {
        console.error("[ERROR]: Failed to fetch plant profiles", error);
        res.status(500).json({ error: "Failed to fetch plant profiles." });
    }
}

export async function savePlantProfile(req, res) {
    try {
        const { plantName, preferences, weatherAlerts, plantImage } = req.body;

        if (!plantName || !plantImage) {
            return res.status(400).json({ error: "Plant name and image are required." });
        }

        const newProfile = await saveProfileToFirebase({
            plantName,
            preferences: preferences || "",
            weatherAlerts: weatherAlerts !== undefined ? weatherAlerts : true,
            plantImage,
            createdAt: new Date().toISOString(),
            messages: {}
        });

        res.status(201).json({ message: "Plant profile saved successfully!", profile: newProfile });
    } catch (error) {
        console.error("[ERROR]: Failed to save plant profile", error);
        res.status(500).json({ error: "Failed to save plant profile." });
    }
}

export async function getPlantProfile(req, res) {
    try {
        const { plantId } = req.params;
        if (!plantId) {
            return res.status(400).json({ error: "Plant ID is required." });
        }

        const profile = await getProfileFromFirebase(plantId);
        if (!profile) {
            return res.status(404).json({ error: "Plant profile not found." });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error("[ERROR]: Failed to fetch plant profile", error);
        res.status(500).json({ error: "Failed to fetch plant profile." });
    }
}

export async function deletePlantProfile(req, res) {
    try {
        const { plantId } = req.params;

        if (!plantId) return res.status(400).json({ error: "Plant ID is required." });

        await deleteProfileFromFirebase(plantId);
        res.status(200).json({ message: "Plant profile deleted successfully." });
    } catch (error) {
        console.error("[ERROR]: Failed to delete plant profile", error);
        res.status(500).json({ error: "Failed to delete plant profile." });
    }
}

export async function getPlantProfileById(req, res) {
    try {
        const { plantId } = req.params;

        if (!plantId) return res.status(400).json({ error: "Plant ID is required." });

        const plantDoc = await db.collection("plant_profiles").doc(plantId).get();

        if (!plantDoc.exists) {
            return res.status(404).json({ error: "Plant profile not found." });
        }

        res.status(200).json(plantDoc.data());
    } catch (error) {
        console.error("[ERROR]: Failed to fetch plant profile by ID", error);
        res.status(500).json({ error: "Failed to fetch plant profile." });
    }
}
