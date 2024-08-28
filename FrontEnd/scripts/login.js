document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (event) {
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
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Utilisateur non trouvé");
        }
        if (response.status === 401) {
          throw new Error("Non autorisé");
        }
        if (!response.ok) {
          throw new Error("Erreur lors de la connexion");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);

        localStorage.setItem("userId", data.userId);
        // Redirection vers la page d'accueil
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
});
