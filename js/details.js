import { loadHeaderFooter } from "./utils.js";
import Movie from "./movie.js";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    if (!movieId) {
        document.querySelector("#movie-details").innerHTML = "<p>Movie not found.</p>";
        return;
    }

    const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];

    const movieData = savedMovies.find((m) => m.id === movieId);

    if (!movieData) {
        document.querySelector("#movie-details").innerHTML = "<p>Movie details not found.</p>";
        return;
    }

    const movie = new Movie(movieData);

    // Extract only the year if the releaseYear looks like "Streaming Aug 11, 2008"
    let yearOnly = movie.releaseYear;

    // If the value has more than 4 characters, assume it's a full phrase, not just a year
    if (typeof yearOnly === "string" && yearOnly.length > 4) {
        const parts = yearOnly.trim().split(" ");
        yearOnly = parts[parts.length - 1]; // take the last word
    }    

    console.log("Extracted year:", yearOnly);

    const detailsContainer = document.querySelector("#movie-details");
    detailsContainer.innerHTML = `
    <div class="movie-detail-card">
      <img src="${movie.image}" alt="${movie.title}">
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p><strong>Type:</strong> ${movie.type.charAt(0).toUpperCase() + movie.type.slice(1)}</p>
        <p><strong>Year:</strong> ${yearOnly}</p>
        <p><strong>Critics:</strong> ${movie.criticsScore}%</p>
        <p><strong>Rating:</strong> ${movie.rating}</p>
        <p><strong>Genres:</strong> ${movie.genres.join(", ")}</p>
        <p><strong>Description:</strong> ${movie.description}</p>
      </div>
    </div>
    `;
});
