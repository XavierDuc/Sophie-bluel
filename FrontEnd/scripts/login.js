document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => {
        return response.json();
      });
      window.location.href = "index.html";
    })
    .catch((error) => {
      // Affichage du message d'erreur
      alert(error.message);
    });
});
