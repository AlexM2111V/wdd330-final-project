// js/utils.mjs
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
    loadTemplate("../partials/header.html")
      .then((template) => renderWithTemplate(template, qs("#main-header"))),
    loadTemplate("../partials/footer.html")
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
