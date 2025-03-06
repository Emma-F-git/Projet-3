import { API_URL } from "./constante.js";

const token = sessionStorage.getItem("token");

const login = document.getElementById("login");
const logout = document.getElementById("logout");
let filters = document.getElementById("filters");
const showButton = document.getElementById("showDialog");
const favDialog = document.getElementById("favDialog");
const outputBox = document.querySelector("output");
const selectEl = favDialog.querySelector("select");
const confirmBtn = favDialog.querySelector("#confirmBtn");

if (token) {
  login.style.display = "none"; /*bouton login non affiché*/
  logout.style.display = "block"; /*bouton logout affiché*/
  filters.style.display = "none"; /*Boutons filtres galerie non affichés*/

  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.reload();
  });
}

// Le bouton « Modifier » ouvre la modale <dialog>
showButton.addEventListener("click", () => {
  favDialog.showModal();
});
// Le bouton "Fermer" ferme le dialogue
closeDialog.addEventListener("click", () => {
  dialog.close();
});

// Empêchez le bouton « Confirmer » de soumettre le formulaire par défaut et fermez la boîte de dialogue avec la méthode `close()`, qui déclenche l'événement "close".
confirmBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Nous ne voulons pas soumettre ce faux formulaire
  favDialog.close(selectEl.value); // Il faut envoyer la valeur du sélecteur ici.
});
