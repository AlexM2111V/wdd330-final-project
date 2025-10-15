import { API_HOST, API_KEY } from "./config.js";
import { loadHeaderFooter, fetchAndRenderMovies } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
    const container = document.getElementById("movies-container");

    fetchAndRenderMovies({
        container,
        endpoint: `https://${API_HOST}/today-recomendations`,
        apiHost: API_HOST,
        apiKey: API_KEY,
    });
});
