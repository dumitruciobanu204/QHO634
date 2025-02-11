document.addEventListener("DOMContentLoaded", async () => {
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const chatMessages = document.querySelector(".chat-messages");
    const imageInput = document.getElementById("imageInput");

    let chatId = null;
    let selectedPlantId = null;
    let selectedPlantName = "";

    async function createNewChatId() {
        const response = await fetch("/chat/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        chatId = data.chatId;
        sessionStorage.setItem("chatId", chatId);
        return chatId;
    }

    async function getChatId() {
        if (!chatId) {
            chatId = await createNewChatId();
        }
        return chatId;
    }

    function getLocationData() {
        return {
            latitude: sessionStorage.getItem("userLatitude") || null,
            longitude: sessionStorage.getItem("userLongitude") || null,
        };
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

    // Detect when a plant profile card is clicked
    document.getElementById("plantProfilesContainer").addEventListener("click", function (event) {
        const plantCard = event.target.closest(".plant-profile-card");
        if (plantCard) {
            selectedPlantId = plantCard.dataset.plantId;
            selectedPlantName = plantCard.dataset.plantName;
            document.getElementById("chatMessages").innerHTML = `<p>Chatting about: <b>${selectedPlantName}</b></p>`;
        }
    });

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;

        appendMessage(message, true);
        messageInput.value = "";

        const { latitude, longitude } = getLocationData();

        try {
            let response, data;

            if (selectedPlantId) {
                // Send message to plant-specific chat
                response = await fetch("/api/plant-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plantId: selectedPlantId, message }),
                });
            } else {
                // Regular chat without plant focus
                const chatId = await getChatId();
                response = await fetch("/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatId, message, latitude, longitude }),
                });
            }

            data = await response.json();
            appendMessage(data.reply, false);
        } catch (error) {
            appendMessage("Error: Unable to connect to the server.", false);
        }
    });

    imageInput.addEventListener("change", async () => {
        const file = imageInput.files[0];
        if (!file) {
            alert("Please select an image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const base64Image = reader.result.split(",")[1];
            appendMessage("📷 Image uploaded", true);

            const { latitude, longitude } = getLocationData();
            const chatId = await getChatId();

            try {
                const response = await fetch("/chat/image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatId, image: base64Image, latitude, longitude }),
                });

                const data = await response.json();
                if (data.reply) {
                    appendMessage(data.reply, false);
                }
            } catch (error) {
                appendMessage("Error: Failed to process image.", false);
            }
        };

        reader.readAsDataURL(file);
    });
});
