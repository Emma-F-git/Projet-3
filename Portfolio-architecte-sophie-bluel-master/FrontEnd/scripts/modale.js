import { API_URL } from "./constante.js";

const token = sessionStorage.getItem("token");

const login = document.getElementById("login");
const logout = document.getElementById("logout");
let filters = document.getElementById("filters");
let topBarEdit = document.getElementById("topBarEdit");

const showButton = document.getElementById("showDialog");
const favDialog = document.getElementById("favDialog");
const dialogGallery = document.getElementById("dialog-gallery");

if (token) {
  login.style.display = "none"; /*bouton login non affiché*/
  logout.style.display = "block"; /*bouton logout affiché*/
  filters.style.display = "none"; /*Boutons filtres galerie non affichés*/
  topBarEdit.style.display =
    "block"; /*Affichage de la barre en haut "Mode édition"*/
  showDialog.style.display =
    "block"; /*Affichage de la boite de dialog "Modifier"*/

  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.reload();
  });
}

async function afficherWorksDialog() {
  try {
    const reponse = await fetch(`${API_URL}works`);
    const works = await reponse.json();
    dialogGallery.innerHTML = ""; // On vide la galerie avant de la remplir

    works.forEach((work) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      const editButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      const deleteIcon = document.createElement("i");

      figure.classList.add("work");
      deleteButton.classList.add("deleteBtn");
      deleteIcon.classList.add("fa-regular");
      deleteIcon.classList.add("fa-trash-can");

      image.setAttribute("src", work.imageUrl);
      image.setAttribute("alt", work.title);

      // Ajout des événements aux boutons
      deleteButton.addEventListener("click", () => supprimerImage(work.id));
      editButton.addEventListener("click", () => modifierImage(work.id));

      deleteButton.appendChild(deleteIcon);
      figure.appendChild(image);
      figure.appendChild(figcaption);
      figure.appendChild(deleteButton);
      dialogGallery.appendChild(figure);
    });
  } catch (error) {
    console.log(
      "Erreur affichage galerie dans la boîte de dialogue: " + error.message
    );
  }
}

// Le bouton « Modifier » ouvre la modale <dialog>
showButton.addEventListener("click", () => {
  afficherWorksDialog();
  favDialog.showModal();
});

document.getElementById("closeDialog").addEventListener("click", () => {
  favDialog.close();
});
favDialog.addEventListener("click", (event) => {
  if (event.target === favDialog) {
    favDialog.close();
  }
});
