import { API_URL } from "./constante.js";

/*Création des boutons dynamiques de filtres pour la galerie*/

let activeFilters = [];

/*Insertion des boutons de filtrage après le titre h2 portfolio*/
const selectionElement = document.querySelector("#portfolio h2");
const gallery = document.getElementById("gallery");

/*Création d'un bouton de filtre*/
function createButton(id, name, classCSS) {
  const button = document.createElement("button");
  button.textContent = name;
  if (classCSS) {
    button.classList.add(classCSS);
  }
  button.setAttribute("data-category-id", id);
  button.addEventListener("click", () => {
    toggleFilter(button, id);
    filterGallery();
  });
  return button;
}

/*Création du bouton "tous"*/
const filterButton = document.createElement("div");
filterButton.id = "filters";
filterButton.classList.add("filters");
selectionElement.after(filterButton);

async function afficherCategories() {
  const filters = document.getElementById("filters");
  try {
    /*Récupération des données sur l'API et conversion de la réponse en format JSON*/
    const reponse = await fetch(`${API_URL}categories`);
    const categories = await reponse.json();
    /*Création d'un bouton "tous" qui n'est pas dans l'API*/
    filters.appendChild(createButton(0, "Tous", "active"));
    /* Boutons récupérés par l'API*/
    categories.forEach((categorie) => {
      filters.appendChild(createButton(categorie.id, categorie.name, null));
    });
  } catch (error) {
    console.error("Erreur dans le filtre par catégorie: " + error.message);
  }
}

async function afficherWorks() {
  try {
    /*Récupération de la galerie sur l'API et conversion de la réponse en format JSON*/
    const reponse = await fetch(`${API_URL}works`);
    const works = await reponse.json();
    /*Suppression de galerie déjà existante en HTML*/
    gallery.innerHTML = "";

    /*Création dynamique des filtres*/
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      figure.classList.add("work");
      figure.textContent = work.name;
      image.setAttribute("src", work.imageUrl);
      image.setAttribute("alt", work.title);
      figcaption.textContent = work.title;
      figure.dataset.categoryId = work.categoryId;
      figure.appendChild(image);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });

    filterGallery();
  } catch (error) {
    console.error("Erreur affichage galerie: " + error.message);
  }
}

function filterGallery() {
  const allWorks = document.querySelectorAll("#gallery .work");

  allWorks.forEach((work) => {
    const workCategory = Number(work.dataset.categoryId);
    if (activeFilters.length === 0 || activeFilters.includes(workCategory)) {
      work.style.display =
        "block"; /*Affiche l'ensemble de la galerie si aucun filtre n'est actif.*/
    } else {
      work.style.display = "none"; /*Affiche la galerie selon les filtres.*/
    }
  });
}

/*Affichage lors du clic du filtre*/
function toggleFilter(button, categoryId) {
  const allButtons = document.querySelectorAll("#filters button");

  if (categoryId === 0) {
    /* Si le bouton "Tous" est cliqué, désactive tous les autres filtres*/
    activeFilters = [];
    allButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.style.backgroundColor = "";
      btn.style.color = "";
    });

    /* Active uniquement le bouton "Tous"*/
    button.classList.add("active");
  } else {
    /* Si un autre filtre est cliqué, désactive le bouton "Tous"*/
    const allButton = document.querySelector('button[data-category-id="0"]');
    allButton.classList.remove("active");

    const index = activeFilters.indexOf(Number(categoryId));
    if (index !== -1) {
      /* Désactive le filtre s'il est déjà actif */
      activeFilters.splice(index, 1);
      button.classList.remove("active");
    } else {
      /* Active le filtre si non actif */
      activeFilters.push(Number(categoryId));
      button.classList.add("active");
    }
  }
}

afficherCategories().then(() => {
  afficherWorks().then(() => {
    filterGallery();
  });
});
