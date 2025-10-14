const API_HOST = "rottentomato.p.rapidapi.com";
const API_KEY = "09a47f9d89mshbe5b73edc659658p1e47e1jsn755abba2db30";

export default class Movie {

    constructor(data) {
        this.id = data.rottenTomatoesId || data.id || crypto.randomUUID();
        this.title = data.title || "Untitled";
        this.image = data.image || data.posterImageUrl || data.image_url || "images/placeholder.png";
        this.type = data.media_type || data.type || data.mediaType || "Movie";
        this.criticsScore = data.critics_score || data.criticsScore || data.rottenTomatoes?.criticsScore || "N/A";
        this.releaseYear = data.releaseYear || data.year || data.release_date || "2000";
        this.rating = data.rating || "G";
        this.genres = data.genres || ["No genre available"];
        this.cast = data.castCrew?.cast || [];
        this.description = data.description || "No description available";
    }

    static async fetchTodayRecommendations() {
        const response = await fetch(`https://${API_HOST}/today-recomendations`, {
            headers: {
                "x-rapidapi-host": API_HOST,
                "x-rapidapi-key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch today's recommendations.");
        }

        const data = await response.json();

        // Filter out invalid entries before mapping to Movie objects, during testing I noticed
        // some entries has unknown media_type or missing critics_score
        const validRecommendations = data.recommendations.filter((item) => {
            return (
                item.title &&
                item.image_url &&
                item.media_type && item.media_type.toLowerCase() !== "unknown" &&
                item.critics_score !== null && item.critics_score !== "N/A"
            );
        });

        // Return only valid movies mapped to Movie instances
        return validRecommendations.map((item) => new Movie(item));
    }

    renderCard() {
        const div = document.createElement("div");
        div.classList.add("movie-card");

        div.innerHTML = `
      <img src="${this.image}" alt="${this.title}" loading="lazy">
      <div class="movie-info">
        <h3>${this.title}</h3>
        <p><strong>Type:</strong> ${this.type.charAt(0).toUpperCase() + this.type.slice(1)}</p>
        <p><strong>Critics:</strong> ${this.criticsScore}%</p>
      </div>
    `;
        // click to go to details page
        div.addEventListener("click", () => {
            const params = new URLSearchParams({ id: this.id });
            window.location.href = `details.html?${params.toString()}`;
        });
        return div;
    }
}
