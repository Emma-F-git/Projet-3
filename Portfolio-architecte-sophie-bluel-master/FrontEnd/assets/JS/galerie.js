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
