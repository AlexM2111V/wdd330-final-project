import { loadHeaderFooter } from "./utils.js";
import Movie from "./movie.js";

document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
    renderFavorites();
});


    function renderFavorites() {
        const container = document.querySelector("#favorites-container");
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        container.innerHTML = "";

        if (favorites.length === 0) {
            container.innerHTML = "<p>No favorites added yet. Browse movies and click the star to add some!</p>";
            return;
        }

        favorites.forEach(fav => {
            const movie = new Movie(fav);
            container.appendChild(movie.renderCard());
        });
    }
