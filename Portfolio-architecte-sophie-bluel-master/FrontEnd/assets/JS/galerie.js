/*Ajout de filtres pour la galerie*/
const selectionElement = document.querySelector("#portfolio h2");

/*Création d'un bouton*/
function createButton(id, name) {
  const button = document.createElement("button");
  button.textContent = name;
  button.setAttribute("data-category-id", id);
  button.addEventListener("click", () => {
    console.log(`Filtre cliqué: ${id}`);
    filterGallery(id);
  });
  return button;
}

/*Création du bouton "tous"*/
const filterButton = document.createElement("div");
filterButton.id = "filters";
selectionElement.after(filterButton);

async function afficherCategories() {
  const filters = document.getElementById("filters");
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    console.log(categories);
    filters.appendChild(createButton(0, "Tous"));
    categories.forEach((categorie) => {
      filters.appendChild(createButton(categorie.id, categorie.name));
    });
  } catch (error) {
    console.log("Erreur dans le filtre par catégorie: " + error.message);
  }
}

const gallery = document.querySelector(".gallery");

async function afficherWorks() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    /*Suppression de galerie déjà existante en HTML*/
    gallery.innerHTML = "";
    console.log(works);

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
  } catch (error) {
    console.log("Erreur affichage galerie: " + error.message);
  }
}

function filterGallery(categoryId) {
  const allWorks = document.querySelectorAll(".work");

  allWorks.forEach((work) => {
    if (
      categoryId === 0 ||
      Number(work.dataset.categoryId) === Number(categoryId)
    ) {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  });
}

afficherCategories();
afficherWorks();
