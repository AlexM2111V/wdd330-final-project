import { loadHeaderFooter } from "./utils.js";

loadHeaderFooter();

const TMDB_API_KEY = "c39a4fe7c4a8a6a174b11eab86ca9444";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");
  const detailsContainer = document.querySelector("#movie-details");

  if (!movieId) {
    detailsContainer.innerHTML = "<p>Movie not found.</p>";
    return;
  }

  const allMovies = [
    ...(JSON.parse(localStorage.getItem("movies")) || []),
    ...(JSON.parse(localStorage.getItem("favorites")) || []),
  ];

  const movieData = allMovies.find((m) => m.id === movieId);

  if (!movieData) {
    detailsContainer.innerHTML = "<p>Movie details not found.</p>";
    return;
  }

  // 🗓️ Extract only the year if releaseYear looks like "Streaming Aug 11, 2008"
  let yearOnly = movieData.releaseYear;
  if (typeof yearOnly === "string" && yearOnly.length > 4) {
    const parts = yearOnly.trim().split(" ");
    yearOnly = parts[parts.length - 1]; // take the last word
  }
  movieData.releaseYear = yearOnly;

  // 🧩 Build details HTML dynamically (only showing valid info)
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
    <div id="trailer-section"><p>Loading trailer...</p></div>
  `;

  // ✨ Apply staggered "fall-in" animation to details elements
  const detailCard = detailsContainer.querySelector(".movie-detail-card");
  if (detailCard) {
    const elements = detailCard.querySelectorAll("img, h2, p");
    elements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    });

    // Trigger animation
    requestAnimationFrame(() => {
      elements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }

  // 🎥 Fetch trailer from TMDB
  try {
    const searchUrl = `${TMDB_BASE_URL}/search/movie?&query=${encodeURIComponent(movieData.title)}&api_key=${TMDB_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.results && searchData.results.length > 0) {
      const tmdbId = searchData.results[0].id;
      const detailsUrl = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=videos`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();

      const trailer = detailsData.videos?.results?.find(
        (v) => v.type === "Trailer" || v.type === "Teaser"
      );

      const trailerSection = document.getElementById("trailer-section");
      if (trailer && trailer.key) {
        trailerSection.innerHTML = `
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/${trailer.key}" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;

        // 🕒 Fade-in effect for trailer after loading
        const iframe = trailerSection.querySelector("iframe");
        iframe.style.opacity = "0";
        iframe.style.transition = "opacity 0.8s ease";
        setTimeout(() => {
          iframe.style.opacity = "1";
        }, 300); // delay so it appears after details
      } else {
        trailerSection.innerHTML = `<p>No trailer available.</p>`;
      }
    } else {
      document.getElementById("trailer-section").innerHTML = `<p>Trailer not found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    document.getElementById("trailer-section").innerHTML = `<p>Error loading trailer.</p>`;
  }
});
