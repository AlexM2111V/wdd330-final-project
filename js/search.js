import Movie from "./movie.js";
import { loadHeaderFooter } from "./utils.js";

const API_HOST = "rottentomato.p.rapidapi.com";
const API_KEY = "09a47f9d89mshbe5b73edc659658p1e47e1jsn755abba2db30";

document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
    const form = document.querySelector("#search-form");
    form.addEventListener("submit", handleSearch);
});

async function handleSearch(e) {
    e.preventDefault();

    const title = document.querySelector("#search-term").value.trim();
    const genre = document.querySelector("#genre").value;
    const resultsContainer = document.querySelector("#results");

    resultsContainer.innerHTML = "<p>Loading...</p>";

    try {
        let url = "";
        if (title && !genre) {
            // search by title
            url = `https://${API_HOST}/search?search-term=${encodeURIComponent(title)}`;
        } else if (title && genre) {
            // search by title, then filter by genre
            url = `https://${API_HOST}/search?search-term=${encodeURIComponent(title)}`;
        } else if (!title && genre) {
            // search by genre only
            url = `https://${API_HOST}/streaming-movies?genre=${encodeURIComponent(genre)}&sortby=critic_highest`;
        } else {
            resultsContainer.innerHTML = `<p id="error">Please enter a title or select a genre.</p>`;
            return;
        }

        const response = await fetch(url, {
            headers: {
                "x-rapidapi-host": API_HOST,
                "x-rapidapi-key": API_KEY,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch data.");
        const data = await response.json();

        console.log("raw response",data);

        // let movies = (data.movie || data.movies || data.searchResults || data.movies_shows || [])
        //     .map(item => new Movie(item));
        
        let movies = (data.movie || data.movies || data.searchResults || data.movies_shows || [])
            .map(item => {
                // If the response didn’t include genres and a genre was selected,
                // inject the selected genre manually
                if ((!item.genres || item.genres.length === 0) && genre) {
                    const formattedGenre = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
                    item.genres = [formattedGenre];
                    
                }
                return new Movie(item);
            });
        
        console.log("only movie data",movies);

        // Filter if both title and genre are present
        if (title && genre) {
            movies = movies.filter(
                (m) =>
                    m.genres &&
                    m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
            );
        }

        console.log(movies);

        // Clean & filter out bad entries
        const validMovies = movies
            // .filter((m) => m.title && m.posterImageUrl && m.criticsScore !== "N/A")
            .filter((m) => m.title && m.image && m.criticsScore !== "N/A")
            .map((m) => new Movie(m));
        
        console.log(validMovies);

        renderMovies(validMovies);
        // renderMovies(movies);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = "<p>Could not load search results.</p>";
    }
}

function renderMovies(movies) {
    const resultsContainer = document.querySelector("#results");
    resultsContainer.innerHTML = "";

    if (movies.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    localStorage.setItem("movies", JSON.stringify(movies));

    movies.forEach((movie) => {
        const card = movie.renderCard();
        card.querySelector("img").addEventListener("click", () => {
            window.location.href = `details.html?id=${movie.id}`;
        });
        resultsContainer.appendChild(card);
    });
}
