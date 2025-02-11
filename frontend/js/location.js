document.addEventListener("DOMContentLoaded", () => {
    function storeLocation(latitude, longitude) {
        sessionStorage.setItem("userLatitude", latitude);
        sessionStorage.setItem("userLongitude", longitude);
        sessionStorage.setItem("locationConsent", "true");
        console.log("Location stored - Lat:", latitude, "Lon:", longitude);
    }

    function handleLocationSuccess(position) {
        const { latitude, longitude } = position.coords;
        storeLocation(latitude, longitude);
    }

    function handleLocationError(error) {
        console.warn("Geolocation error:", error.message);

        // Fallback: Get approximate location based on IP
        fetch('/get-location-ip')
            .then(response => response.json())
            .then(data => {
                if (data.latitude && data.longitude) {
                    storeLocation(data.latitude, data.longitude);
                } else {
                    sessionStorage.setItem("locationConsent", "false");
                }
            })
            .catch(() => {
                sessionStorage.setItem("locationConsent", "false");
            });
    }

    if (!sessionStorage.getItem("locationConsent")) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
        } else {
            console.warn("Geolocation not supported.");
            sessionStorage.setItem("locationConsent", "false");
        }
    }
});
