/*Affichage d'un bouton de déconnection log out lorsque l'on est connecté*/

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  const login = document.getElementById("login");

  if (token) {
    login.innerHTML = "logout";
    login.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.reload();
    });
  }
});
