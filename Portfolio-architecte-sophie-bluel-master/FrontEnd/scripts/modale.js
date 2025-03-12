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
  showButton.style.display =
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
    dialogGallery.innerHTML = ""; /*galerie vide avant de la remplir*/

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

      /*Ajout des événements aux boutons*/
      deleteButton.addEventListener("click", () => deletePicture(work.id));
      editButton.addEventListener("click", () => editPicture(work.id));

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

/*Le bouton « Modifier » ouvre la modale <dialog>*/
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

/*Suppression des travaux avec le clic sur l'icone poubelle*/
async function deletePicture(workId) {
  try {
    const response = await fetch(`${API_URL}works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Échec de la suppression de l'image");
    }

    afficherWorksDialog();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

/*Ajout des photos avec le clic sur le bouton "+Ajouter photo"*/
document.addEventListener("DOMContentLoaded", () => {
  const addPictureButton = document.getElementById("addPicture");
  const backToGalleryButton = document.getElementById("backToGallery");

  const galleryContainer = document.getElementById("dialog-gallery");
  const formContainer = document.getElementById("addPictureFormContainer");
  const fileInput = document.getElementById("hidenFileInput");

  function toggleForm(showForm) {
    if (!galleryContainer || !formContainer) {
      console.error("Erreur : les éléments n'ont pas été trouvés !");
      return;
    }

    const titleGallery = document.querySelector("dialog h3");

    if (showForm) {
      galleryContainer.style.display = "none";
      formContainer.style.display = "block";
      if (titleGallery) titleGallery.style.display = "none";
      if (addPictureButton) addPictureButton.style.display = "none";

      chargerCategories();
    } else {
      formContainer.style.display = "none";
      galleryContainer.style.display = "block";
      if (titleGallery) titleGallery.style.display = "block";
      if (addPictureButton) addPictureButton.style.display = "block";

      dialogGallery.innerHTML = "";
      afficherWorksDialog();
    }
  }

  addPictureButton?.addEventListener("click", () => toggleForm(true));
  backToGalleryButton?.addEventListener("click", () => toggleForm(false));

  document.querySelector(".add-button")?.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    if (event.target.files.length > 0) {
      document.querySelector(".file-info").textContent =
        event.target.files[0].name;
    }
  });

  async function chargerCategories() {
    try {
      const response = await fetch(`${API_URL}categories`);
      const categories = await response.json();
      const selectCategory = document.getElementById("category");

      selectCategory.innerHTML = categories
        .map(({ id, name }) => `<option value="${id}">${name}</option>`)
        .join("");
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    }
  }
});

/*Ajout d'une condition d'activation pour le bouton valider*/
document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const validateButton = document.getElementById("validatePicture");

  function checkFormCompletion() {
    if (
      imageInput.files.length > 0 &&
      titleInput.value.trim() !== "" &&
      categorySelect.value
    ) {
      validateButton.removeAttribute("disabled");
    } else {
      validateButton.setAttribute("disabled", "true");
    }
  }
  imageInput.addEventListener("change", checkFormCompletion);
  titleInput.addEventListener("input", checkFormCompletion);
  categorySelect.addEventListener("change", checkFormCompletion);
});
