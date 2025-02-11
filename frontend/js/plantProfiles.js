document.addEventListener("DOMContentLoaded", async () => {
    const plantProfilesContainer = document.getElementById("plantProfilesContainer");
    const chatMessages = document.getElementById("chatMessages");
    const imageInput = document.getElementById("imageInput");
    const attachmentIcon = document.getElementById("attachmentIcon");

    let selectedPlantId = null;

    async function deletePlantProfile(profileId) {
        try {
            const response = await fetch(`/api/plant-profiles/${profileId}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete plant profile.");
            }
    
            document.querySelector(`[data-plant-id="${profileId}"]`)?.remove();
            // console.log(`Plant profile ${profileId} deleted successfully`);
    
        } catch (error) {
            console.error("Error deleting plant profile:", error);
        }
    }
    

    async function loadPlantProfiles() {
        try {
            const response = await fetch("/api/plant-profiles");
            if (!response.ok) {
                throw new Error("Failed to fetch plant profiles.");
            }

            const profiles = await response.json();
            plantProfilesContainer.innerHTML = "";

            profiles.forEach(profile => {
                const profileCard = document.createElement("div");
                profileCard.classList.add("plant-profile-card");
                profileCard.dataset.plantId = profile.id;
                profileCard.dataset.plantName = profile.plantName;

                profileCard.innerHTML = `
                    <div class="profile-header">
                        <img src="data:image/jpeg;base64,${profile.plantImage}" alt="${profile.plantName}" class="plant-profile-image">
                        <span class="plant-profile-name">${profile.plantName}</span>
                        <button class="delete-profile-button" data-id="${profile.id}" title="Delete">X</button>
                    </div>
                `;

                profileCard.addEventListener("click", () => selectPlantProfile(profile.id, profile.plantName));

                plantProfilesContainer.appendChild(profileCard);
            });

            attachDeleteListeners();
        } catch (error) {
            console.error("Error loading plant profiles:", error);
        }
    }

    function attachDeleteListeners() {
        document.querySelectorAll(".delete-profile-button").forEach(button => {
            button.addEventListener("click", async (event) => {
                const profileId = event.target.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this plant profile?")) {
                    deletePlantProfile(profileId);
                }
            });
        });
    }

    async function selectPlantProfile(plantId, plantName) {
        selectedPlantId = plantId;
        chatMessages.innerHTML = `<p>Chatting about: <b>${plantName}</b></p>`;
    
        imageInput.style.display = "none";
        attachmentIcon.style.display = "none";
    
        try {
            const response = await fetch(`/api/plant-profiles/${plantId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch plant messages.");
            }
    
            const profileData = await response.json();
    
            chatMessages.innerHTML = `<p>Chatting about: <b>${plantName}</b></p>`;
    
            if (profileData.messages && profileData.messages.initialAdvice) {
                appendMessage(profileData.messages.initialAdvice, false);
            }
    
            if (Array.isArray(profileData.messages)) {
                profileData.messages.forEach(msg => {
                    appendMessage(msg.content, msg.role === "user");
                });
            }
    
        } catch (error) {
            console.error("Error loading plant messages:", error);
        }
    }
    

    function appendMessage(content, isUser = true) {
        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add("message-wrapper", isUser ? "user-wrapper" : "bot-wrapper");

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");
        messageDiv.textContent = content;

        messageWrapper.appendChild(messageDiv);
        chatMessages.appendChild(messageWrapper);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    loadPlantProfiles();
});
