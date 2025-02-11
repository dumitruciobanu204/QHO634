document.addEventListener("DOMContentLoaded", () => {
    const createProfileButton = document.getElementById("createProfileButton");
    const plantProfileModal = document.getElementById("plantProfileModal");
    const closePlantProfileModal = document.getElementById("closePlantProfileModal");
    const plantProfileForm = document.getElementById("plantProfileForm");

    // Hide modal on page load
    plantProfileModal.classList.remove("active");

    // Open modal when "Create Plant Profile" button is clicked
    createProfileButton.addEventListener("click", () => {
        plantProfileModal.classList.add("active");
    });

    // Close modal when the close button is clicked
    closePlantProfileModal.addEventListener("click", () => {
        plantProfileModal.classList.remove("active");
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === plantProfileModal) {
            plantProfileModal.classList.remove("active");
        }
    });

    // Handle form submission
    plantProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const plantName = document.getElementById("plantName").value.trim();
        const preferences = document.getElementById("preferences").value.trim();
        const weatherAlerts = document.getElementById("weatherAlerts").checked;
        const plantImage = document.getElementById("plantImage").files[0];

        if (!plantName || !plantImage) {
            alert("Plant name and image are required.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const base64Image = reader.result.split(",")[1];

            const profileData = {
                plantName,
                preferences,
                weatherAlerts,
                plantImage: base64Image,
            };

            try {
                const response = await fetch("/api/plant-profiles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profileData),
                });

                if (response.ok) {
                    alert("Plant profile saved successfully!");
                    plantProfileModal.classList.remove("active");
                    plantProfileForm.reset();
                } else {
                    alert("Failed to save plant profile. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while saving the profile.");
            }
        };

        reader.readAsDataURL(plantImage);
    });
});
