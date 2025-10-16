import { API_HOST, API_KEY } from "./config.js";
import { loadHeaderFooter, fetchAndRenderMovies } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {

    try {
        loadHeaderFooter();
        const container = document.getElementById("movies-container");

        await fetchAndRenderMovies({
            container,
            endpoint: `https://${API_HOST}/today-recomendations`,
            apiHost: API_HOST,
            apiKey: API_KEY,
        });
    } catch (error) {
        console.error("Error loading home page data:", error);
        const container = document.getElementById("movies-container");
        if (container) {
            container.innerHTML = `<p>Sorry, we couldn't load today's recommendations. Please try again later.</p>`;
        }
    }
});
