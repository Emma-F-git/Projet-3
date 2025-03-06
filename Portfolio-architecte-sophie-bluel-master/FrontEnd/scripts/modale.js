import { API_URL } from "./constante.js";

const token = sessionStorage.getItem("token");

const login = document.getElementById("login");
const logout = document.getElementById("logout");
const filters = document.getElementById("filters");
const showButton = document.getElementById("showDialog");
const favDialog = document.getElementById("favDialog");
const outputBox = document.querySelector("output");
const selectEl = favDialog.querySelector("select");
const confirmBtn = favDialog.querySelector("#confirmBtn");

if (token) {
  /*Si connexion administrateur bouton login caché et bouton logout affiché*/
  login.style.display = "none";
  logout.style.display = "block";
  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.reload();
  });
}

if (filters) {
  filters.style.display = "none";
}

// Le bouton « Mettre à jour les détails » ouvre la modale <dialog>
showButton.addEventListener("click", () => {
  favDialog.showModal();
});

// L'entrée « Animal préféré » définit la valeur du bouton d'envoi.
selectEl.addEventListener("change", (e) => {
  confirmBtn.value = selectEl.value;
});

// Le bouton « Annuler » ferme la boîte de dialogue sans la soumettre en raison de l'attribut [formmethod="dialog"], ce qui déclenche un événement de fermeture.
favDialog.addEventListener("close", (e) => {
  outputBox.value =
    favDialog.returnValue === "default"
      ? "Pas de valeur retournée."
      : `Valeur retournée : ${favDialog.returnValue}.`; // Vérifie la présence de "default" au lieu d'une chaîne vide
});

// Empêchez le bouton « Confirmer » de soumettre le formulaire par défaut et fermez la boîte de dialogue avec la méthode `close()`, qui déclenche l'événement "close".
confirmBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Nous ne voulons pas soumettre ce faux formulaire
  favDialog.close(selectEl.value); // Il faut envoyer la valeur du sélecteur ici.
});
