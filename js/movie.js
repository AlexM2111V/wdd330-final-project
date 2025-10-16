import { alertMessage } from "./utils.js";

export default class Movie {
    constructor(data) {

        // Generate a stable ID
        const baseId = data.rottenTomatoesId || data.id;
        if (baseId) {
            this.id = baseId;
        } else {
            const uniqueKey = [
                data.title || "unknown",
                data.type || data.media_type || "movie",
                data.image || ""
            ].join("-");
            this.id = this.generateStableId(uniqueKey);
        }

        this.title = data.title || "";
        this.image = data.image || data.posterImageUrl || data.image_url || "";
        this.type = data.media_type || data.type || data.mediaType || "Movie";
        this.criticsScore = data.critics_score || data.criticsScore || data.rottenTomatoes?.criticsScore || null;
        this.audienceScore = data.audience_score || data.audienceScore || data.rottenTomatoes?.audienceScore || null;
        this.releaseYear = data.releaseYear || data.year || data.release_date || null;
        this.rating = data.rating || "G";
        this.genres = data.genres || [];
        this.cast = data.castCrew?.cast || [];
        this.description = data.description || "";

        // Sync favorite state with localStorage
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        this.isFavorite = favorites.some(fav => fav.id === this.id);
    }

    generateStableId(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        return `auto-${Math.abs(hash)}`;
    }

    checkFavoriteStatus() {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        return favorites.some((fav) => fav.id === this.id);
    }

    toggleFavorite() {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const exists = favorites.some(fav => fav.id === this.id);

        if (exists) {
            favorites = favorites.filter(fav => fav.id !== this.id);
            this.isFavorite = false;
        } else {
            favorites.push(this);
            this.isFavorite = true;
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    renderCard(index = 0) {
        const div = document.createElement("div");
        div.classList.add("movie-card");
        div.style.setProperty("--delay", `${index * 0.1}s`);

        let isFav = this.isFavorite;
        
        div.innerHTML = `
            <div class="movie-inner">
                <div class="movie-front">
                <img src="${this.image}" alt="${this.title}" loading="lazy">
                </div>
                <div class="movie-back" style="background-image: url('${this.image}')">
                <div class="movie-overlay">
                    <h3>${this.title}</h3>
                    ${this.type ? `<p><strong>Type:</strong> ${this.type.charAt(0).toUpperCase() + this.type.slice(1)}</p>` : ""}
                    ${this.criticsScore != null && this.criticsScore !== "N/A" ? `<p><strong>Critics Score:</strong> ${this.criticsScore}%</p>` : ""}
                    ${this.audienceScore ? `<p><strong>Audience Score:</strong> ${this.audienceScore}%</p>` : ""}
                    ${this.releaseYear ? `<p><strong>Year:</strong> ${this.releaseYear}</p>` : ""}
                    ${this.genres && this.genres.length ? `<p><strong>Genres:</strong> ${this.genres.join(", ")}</p>` : ""}
                    <button 
                    class="favorite-btn ${isFav ? "favorited" : ""}" 
                    aria-label="Toggle favorite" 
                    data-id="${this.id}">
                    ${isFav ? "⭐" : "☆"}
                    </button>
                </div>
                </div>
            </div>
            `;

        // Flip card to go to details when clicking image
        div.querySelector(".movie-back").addEventListener("click", () => {
            const params = new URLSearchParams({ id: this.id });
            window.location.href = `details.html?${params.toString()}`;
        });

        // Favorite button toggle
        const favoriteBtn = div.querySelector(".favorite-btn");
        favoriteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleFavorite();

            if (this.isFavorite) {
                alertMessage(`${this.title} was added to favorites!`);
            } else {
                alertMessage(`${this.title} was removed from favorites.`);
            }

            const isFavNow = this.isFavorite;
            favoriteBtn.classList.toggle("favorited", isFavNow);
            favoriteBtn.textContent = isFavNow ? "⭐" : "☆";
            favoriteBtn.classList.add("animate");
            setTimeout(() => favoriteBtn.classList.remove("animate"), 300);

            if (window.location.pathname.includes("favorites.html") && !isFavNow) {
                const container = document.querySelector("#favorites-container");
                const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                container.innerHTML = favorites.length
                    ? favorites.map((f, i) => new Movie(f).renderCard(i).outerHTML).join("")
                    : "<p>No favorites yet.</p>";
            }
        });

        return div;
    }


}
