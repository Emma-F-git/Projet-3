/*Intégration et gestion dynamique de la page de connexion pour le site*/

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("Il n’y a pas eu de rechargement de page");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(email);
  console.log(password);

  const chargeUtile = JSON.stringify({ email, password });
  const errorMessage = document.getElementById("errorMessage");

  try {
    /*Envoi d'une requête POST à l'API*/
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    });

    if (response.status !== 200) {
      errorMessage.textContent =
        "Erreur dans l’identifiant ou le mot de passe"; /*Affichage d'un message d'erreur en cas d'erreur de connexion*/
    } else {
      const data = await response.json();
      sessionStorage.setItem("token", data.token); /*stockage du token*/
      window.location.replace("index.html");
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
});
