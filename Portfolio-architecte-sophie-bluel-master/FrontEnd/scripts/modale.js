import { API_URL } from "./constante.js";

const token = sessionStorage.getItem("token");

const login = document.getElementById("login");
const logout = document.getElementById("logout");
let filters = document.getElementById("filters");
let topBarEdit = document.getElementById("topBarEdit");

const showButton = document.getElementById("showDialog");
const favDialog = document.getElementById("favDialog");
const dialogGallery = document.getElementById("dialog-gallery");

/*Affichage une fois l'utilisateur connecté de l'interface en mode édition*/

if (token) {
  /*bouton login non affiché*/
  login.classList.add("hide");
  /*bouton logout affiché*/
  logout.classList.remove("hide");
  /*boutons filtres galerie non affichés*/
  filters.classList.add("hide");
  /*Affichage de la barre en haut "Mode édition"*/
  topBarEdit.classList.remove("hide");
  /*Affichage de la boite de dialog "Modifier"*/
  showButton.classList.remove("hide");

  /*Lors de la déconnexion, suppression du token, rechargement de la page*/
  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.reload();
  });

  /*Récupération des images de la galerie pour la modale dialog*/
  async function afficherWorksDialog() {
    try {
      const reponse = await fetch(`${API_URL}works`);
      const works = await reponse.json();
      dialogGallery.innerHTML = "";

      works.forEach((work) => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", work.id);
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

        /*Ajout des événements aux boutons supprimer, éditer l'image*/
        deleteButton.addEventListener("click", () => deletePicture(work.id));
        editButton.addEventListener("click", () => editPicture(work.id));

        deleteButton.appendChild(deleteIcon);
        figure.appendChild(image);
        figure.appendChild(figcaption);
        figure.appendChild(deleteButton);
        dialogGallery.appendChild(figure);
      });
    } catch (error) {
      console.error(
        "Erreur affichage galerie dans la boîte de dialogue: " + error.message
      );
    }
  }

  /*Charge les catégorie dans la modale, menu, ajouter photo, catégories*/
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

  function toggleForm(showForm) {
    const galleryContainer = document.getElementById("dialog-gallery");
    const formContainer = document.getElementById("addPictureFormContainer");
    const addPictureButton = document.getElementById("addPicture");
    const greyBar = document.getElementById("greyBar");
    const greyBarValidate = document.getElementById("greyBarValidate");
    const titleGallery = document.querySelector("dialog h3");
    let elementsGallery = [
      galleryContainer,
      titleGallery,
      addPictureButton,
      greyBar,
    ];
    let elementsForm = [formContainer, greyBarValidate, validatePicture];

    if (!galleryContainer || !formContainer) {
      console.error("Erreur : les éléments n'ont pas été trouvés !");
      return;
    }
    if (showForm) {
      elementsGallery.forEach((element) => element.classList.add("hide"));
      elementsForm.forEach((element) => element.classList.remove("hide"));
      galleryContainer.classList.remove("showGrid");
    } else {
      elementsGallery.forEach((element) => element.classList.remove("hide"));
      elementsForm.forEach((element) => element.classList.add("hide"));
      galleryContainer.classList.add("showGrid");
      afficherWorksDialog();
    }
    chargerCategories();
  }

  /*Le bouton « Modifier » ouvre la modale dialog*/
  showButton.addEventListener("click", () => {
    afficherWorksDialog();
    favDialog.showModal();
  });

  /*Fermeture de la modale par le clic sur la croix ou en dehors de la modale*/
  document.getElementById("closeDialog").addEventListener("click", () => {
    favDialog.close();
  });
  favDialog.addEventListener("click", (event) => {
    if (event.target === favDialog) {
      favDialog.close();
    }
  });

  /*Suppression des travaux au clic de l'icone suppression/poubelle*/
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

      const figureToDelete = document.querySelector(`[data-id='${workId}']`);
      if (figureToDelete) {
        figureToDelete.remove();
      }

      const mainGalleryItem = document.querySelector(
        `#gallery [data-id='${workId}']`
      );
      if (mainGalleryItem) {
        mainGalleryItem.remove();
      }

      const successDeletePicture = document.getElementById(
        "successDeletePicture"
      );
      successDeletePicture.style.display = "block";
      setTimeout(() => {
        successDeletePicture.style.display = "none";
      }, 6000);
      afficherWorksDialog();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }

  /*Ajout des photos avec le clic sur le bouton "+Ajouter photo"*/
  document.addEventListener("DOMContentLoaded", () => {
    const addPictureButton = document.getElementById("addPicture");
    const backToGalleryButton = document.getElementById("backToGallery");

    const fileInput = document.getElementById("hidenFileInput");
    const imagePreviewContainer = document.getElementById(
      "imagePreviewContainer"
    );
    const imagePreview = document.getElementById("imagePreview");
    const previewImage = document.getElementById("previewImage");
    const validatePicture = document.getElementById("validatePicture");
    const title = document.getElementById("title");
    const category = document.getElementById("category");

    function checkFormValidity() {
      const imageFile = fileInput.files[0];
      const titleValue = title.value.trim();
      const categoryValue = category.value;

      /*Activer le bouton Valider après la sélection de l'image*/
      if (imageFile && titleValue && categoryValue) {
        validatePicture.removeAttribute("disabled");
      } else {
        validatePicture.setAttribute("disabled", "true");
      }
    }

    /*Sélection d'une image à ajouter*/
    fileInput.addEventListener("change", (event) => {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();

        /*Prévisualiser l'image*/
        reader.onload = function (e) {
          previewImage.src = e.target.result;

          /*Afficher la prévisualisation de l'image et cacher l'icône + texte*/
          imagePreviewContainer.style.display = "none";
          imagePreview.style.display = "block";

          checkFormValidity();
        };
        reader.readAsDataURL(file);
      }
    });

    title.addEventListener("input", checkFormValidity);
    category.addEventListener("change", checkFormValidity);

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
  });

  /*Ajout d'une condition d'activation pour le bouton valider*/
  const imageInput = document.getElementById("hidenFileInput");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const validatePicture = document.getElementById("validatePicture");

  document
    .getElementById("addProjectForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const imageFile = imageInput.files[0];
      const title = titleInput.value.trim();
      const categoryId = categorySelect.value;

      if (!imageFile) {
        alert("Veuillez sélectionner une image.");
        return;
      }

      /*Envoi de la requête à l'API pour ajouter des images*/
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("title", title);
      formData.append("category", categoryId);
      formData.append("userId", 0);

      try {
        const response = await fetch(`${API_URL}works`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const newWork = await response.json();
          afficherNouvelleImage(newWork);

          imageInput.value = "";
          titleInput.value = "";
          categorySelect.selectedIndex = 0;
          validatePicture.setAttribute("disabled", "true");
          toggleForm(false);

          const successMessage = document.getElementById("successAddPicture");
          successMessage.style.display = "block";
          setTimeout(() => {
            successMessage.style.display = "none";
          }, 6000);
        } else {
          alert("Erreur lors de l'ajout de la photo.");
        }
      } catch (error) {
        console.error("Erreur d'envoi à l'API:", error);
        alert("Une erreur est survenue.");
      }
    });

  function afficherNouvelleImage(work) {
    const gallery = document.getElementById("gallery");
    const figure = document.createElement("figure");
    figure.setAttribute("data-id", work.id);
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    image.setAttribute("src", work.imageUrl);
    image.setAttribute("alt", work.title);
    figcaption.textContent = work.title;

    figure.classList.add("work");

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}
