document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  const login = document.querySelector("li a[href='login.html']");

  if (token) {
    login.outerHTML = '<li><a href="#" id="logoutButton">logout</a></li>';
    document
      .getElementById("logoutButton")
      .addEventListener("click", (event) => {
        event.preventDefault();
        sessionStorage.removeItem("token");
        window.location.reload();
      });
  }
});
