import { loadHeaderFooter, renderItems } from "./utils.js";
import Movie from "./movie.js";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");
  const detailsContainer = document.querySelector("#movie-details");

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

  // Extract only the year if the releaseYear looks like "Streaming Aug 11, 2008"
  let yearOnly = movieData.releaseYear;

  // If the value has more than 4 characters, assume it's a full phrase, not just a year
  if (typeof yearOnly === "string" && yearOnly.length > 4) {
      const parts = yearOnly.trim().split(" ");
      yearOnly = parts[parts.length - 1]; // take the last word
  }
  
  movieData.releaseYear = yearOnly;
  
  detailsContainer.innerHTML = `
  <div class="movie-detail-card">
    <img src="${movieData.image}" alt="${movieData.title}">
    <div class="movie-info">
      <h2>${movieData.title}</h2>

      ${movieData.type ? `<p><strong>Type:</strong> ${movieData.type.charAt(0).toUpperCase() + movieData.type.slice(1)}</p>` : ""}
      ${yearOnly ? `<p><strong>Year:</strong> ${yearOnly}</p>` : ""}
      ${movieData.criticsScore ? `<p><strong>Critics Score:</strong> ${movieData.criticsScore}%</p>` : ""}
      ${movieData.audienceScore ? `<p><strong>Audience Score:</strong> ${movieData.audienceScore}%</p>` : ""}
      ${movieData.rating ? `<p><strong>Rating:</strong> ${movieData.rating}</p>` : ""}
      ${movieData.genres && movieData.genres.length ? `<p><strong>Genres:</strong> ${movieData.genres.join(", ")}</p>` : ""}
      ${movieData.cast && movieData.cast.length ? `<p><strong>Cast:</strong> ${movieData.cast.join(", ")}</p>` : ""}
      ${movieData.description ? `<p><strong>Description:</strong> ${movieData.description}</p>` : ""}

    </div>
  </div>
`;

});
