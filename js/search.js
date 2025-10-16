import { API_HOST, API_KEY } from "./config.js";
import { loadHeaderFooter, fetchAndRenderMovies, alertMessage } from "./utils.js";


document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
    alertMessage("Search for movies by title, by genre, or by both title and genre.", true, true);
    const form = document.querySelector("#search-form");
    const resultsContainer = document.querySelector("#results");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.querySelector("#search-term").value.trim();
        const genre = document.querySelector("#genre").value;
        fetchAndRenderMovies({
            container: resultsContainer,
            title,
            genre,
            apiHost: API_HOST,
            apiKey: API_KEY,
        });
    });
});