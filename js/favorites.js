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

    favorites.forEach((fav) => {
        const movie = new Movie(fav);
        const card = movie.renderCard();
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        container.appendChild(card);
    });

    // ✅ Rebind star/favorite button handlers every render
    setupRemoveFavoriteHandlers();
}

function setupRemoveFavoriteHandlers() {
    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    favoriteButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click bubbling to parent
            const movieId = btn.dataset.id;
            removeFavorite(movieId);
        });
    });
}

function removeFavorite(movieId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((movie) => movie.id !== movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Re-render list after removal
    renderFavorites();
}
