import Movie from "./movie.js";
import { loadHeaderFooter } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
});


function getRandomMovies(arr, count = 6) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("movies-container");
    try {
        const movies = await Movie.fetchTodayRecommendations();
        const randomMovies = getRandomMovies(movies, 6);
        container.innerHTML = "";
        randomMovies.forEach((m) => container.appendChild(m.renderCard()));
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Could not load recommendations.</p>";
    }
});
