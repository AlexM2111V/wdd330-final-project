import Movie from "./movie.js";

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Error loading ${path}: ${response.statusText}`);
  return await response.text();
}

export function renderWithTemplate(template, container) {
  container.innerHTML = template;
}

export function loadHeaderFooter() {
  return Promise.all([
    loadTemplate("./partials/header.html")
      .then((template) => renderWithTemplate(template, qs("#main-header"))),
    loadTemplate("./partials/footer.html")
      .then((template) => renderWithTemplate(template, qs("#main-footer")))
  ])
    //after header and footer are loaded, setup the hamburger menu
    .then(() => {
      setupHamburgerMenuAndYear();
    })
    .catch((err) => console.error("Header/Footer load failed:", err));
}


export function setupHamburgerMenuAndYear() {
  const hambutton = document.querySelector("#menu");
  const mainnav = document.querySelector('#nav-bar');
  const header = document.querySelector('header');

  hambutton.addEventListener('click', () => {
    mainnav.classList.toggle('show');
    hambutton.classList.toggle('show');
    header.classList.toggle('show');
  });

  // Footer date
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

export function renderItems(container, templateFn, dataArray) {
  if (!container) {
    console.error("No container provided for rendering.");
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    container.innerHTML = `<p id="error">Please enter a title or select a genre.</p>`;
    return;
  }

  dataArray.forEach((item, index) => {
    const element = templateFn(item, index);
    if (element instanceof HTMLElement) {
      container.appendChild(element);
    } else if (typeof element === "string") {
      container.insertAdjacentHTML("beforeend", element);
    } else {
      console.warn("renderItems: templateFn produced unsupported type", element);
    }
  });
}

export async function fetchAndRenderMovies({
  container,
  endpoint = "",
  title = "",
  genre = "",
  apiHost = "",
  apiKey = "",
  renderFn = (movie) => movie.renderCard(),
  saveKey = "movies",
}) {
  if (!container) {
    console.error("fetchAndRenderMovies: container is required");
    return;
  }

  container.innerHTML = "<p>Loading...</p>";

  try {

    // Build endpoint if not explicitly provided (for search page)
    let url = endpoint;
    if (!url) {
      if (title && !genre) {
        url = `https://${apiHost}/search?search-term=${encodeURIComponent(title)}`;
      } else if (title && genre) {
        url = `https://${apiHost}/search?search-term=${encodeURIComponent(title)}`;
      } else if (!title && genre) {
        url = `https://${apiHost}/streaming-movies?genre=${encodeURIComponent(genre)}&sortby=critic_highest`;
      } else {
        container.innerHTML = `<p id="error">Please enter a title or select a genre.</p>`;
        return;
      }
    }


    const response = await fetch(url, {
      headers: {
        "x-rapidapi-host": apiHost,
        "x-rapidapi-key": apiKey,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data.");
    const data = await response.json();

    // Normalize different response shapes
    let items = [];
    if (data.recommendations) items = data.recommendations;
    else items = data.movie || data.movies || data.searchResults || data.movies_shows || [];

    // Add genre when missing, when searching by genre the response doesn't include it
    let movies = items.map((item) => {
      if ((!item.genres || item.genres.length === 0) && genre) {
        const formattedGenre = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
        item.genres = [formattedGenre];
      }

      return new Movie(item);
    });

    // If user provided both title & genre, filter by genre
    if (title && genre) {
      movies = movies.filter(
        (m) => m.genres && m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    // Final filtering: ensure required display fields exist

    const validMovies = movies.filter((m) => m.title && m.image && m.image !== "none" && m.criticsScore !== "N/A" && m.criticsScore != null);

    // Save for details page
    localStorage.setItem(saveKey, JSON.stringify(validMovies));

    renderItems(container, (movie) => {
      return renderFn(movie);
    }, validMovies);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Could not load results.</p>";
  }
}


export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<span class="alert-message">${message}</span>
      <button class="alert-close">×</button>
  `;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "BUTTON") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);
}