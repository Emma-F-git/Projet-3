/*Ajout de filtres pour la galerie*/

const filters = document.getElementById("filters");

async function afficherCategories() {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    console.log(categories);

    categories.forEach((categorie) => {
      const button = document.createElement("button");
      button.textContent = categorie.name;
      button.setAttribute("filters", categorie.id);
      filters.appendChild(button);
    });
  } catch (error) {
    console.log("Erreur dans le filtre par catégorie: " + error.message);
  }
}

afficherCategories();

const gallery = document.querySelector(".gallery");

async function afficherWorks() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    console.log(works);

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.textContent = work.name;
      figure.setAttribute("title", work.id);
      figure.setAttribute("data-image-url", work.id);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.log("Erreur affichage galerie: " + error.message);
  }
}

afficherWorks();
