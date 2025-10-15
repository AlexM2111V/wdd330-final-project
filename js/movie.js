export default class Movie {

    constructor(data) {
        this.id = data.rottenTomatoesId || data.id || crypto.randomUUID();
        this.title = data.title || "Untitled";
        this.image = data.image || data.posterImageUrl || data.image_url || "";
        this.type = data.media_type || data.type || data.mediaType || "Movie";
        this.criticsScore = data.critics_score || data.criticsScore || data.rottenTomatoes?.criticsScore || null;
        this.audienceScore = data.audience_score || data.audienceScore || data.rottenTomatoes?.audienceScore || null;
        this.releaseYear = data.releaseYear || data.year || data.release_date || null;
        this.rating = data.rating || "G";
        this.genres = data.genres || [];
        this.cast = data.castCrew?.cast || [];
        this.description = data.description || "";
    }

    renderCard() {
        const div = document.createElement("div");
        div.classList.add("movie-card");

        div.innerHTML = `
      <img src="${this.image}" alt="${this.title}" loading="lazy">
      <div class="movie-info">
        <h3>${this.title}</h3>
        <p><strong>Type:</strong> ${this.type.charAt(0).toUpperCase() + this.type.slice(1)}</p>
        <p><strong>Critics Score:</strong> ${this.criticsScore}%</p>
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

