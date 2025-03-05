/*Affichage d'un bouton de déconnection log out lorsque l'on est connecté*/

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  const loginButton = document.getElementById("loginButton");

  if (token) {
    loginButton.innerHTML = '<a href="#" id="logout">logout</a>';
    document.getElementById("logout").addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.reload();
    });
  }
});
