document.addEventListener("DOMContentLoaded", function () {
  let works = []; // Pour stocker tous les travaux

  // Fonction pour afficher les travaux filtrés
  function displayWorks(filteredWorks) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Vider la galerie

    filteredWorks.forEach((work) => {
      const project = document.createElement("project");
      const img = document.createElement("img");
      const imgTitle = document.createElement("imgTitle");

      img.src = work.imageUrl;
      img.alt = work.title;
      imgTitle.textContent = work.title;

      project.appendChild(img);
      project.appendChild(imgTitle);
      gallery.appendChild(project);
    });
  }

  // Fonction pour créer le menu de filtres
  function createFilterMenu(categories) {
    const filterMenu = document.createElement("div");
    filterMenu.className = "filter-menu";

    // Ajouter le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => displayWorks(works));
    filterMenu.appendChild(allButton);

    // Ajouter un bouton pour chaque catégorie
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.addEventListener("click", () => {
        const filteredWorks = works.filter(
          (work) => work.categoryId === category.id
        );
        displayWorks(filteredWorks);
      });
      filterMenu.appendChild(button);
    });

    // Ajouter le menu de filtres avant la galerie
    const portfolio = document.getElementById("portfolio");
    portfolio.insertBefore(filterMenu, document.querySelector(".gallery"));
  }

  // Récupérer les travaux et les catégories
  Promise.all([
    fetch("http://localhost:5678/api/works").then((response) =>
      response.json()
    ),
    fetch("http://localhost:5678/api/categories").then((response) =>
      response.json()
    ),
  ])
    .then(([worksData, categoriesData]) => {
      works = worksData; // Stocker tous les travaux
      displayWorks(works); // Afficher tous les travaux initialement
      createFilterMenu(categoriesData); // Créer le menu de filtres
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données:", error);
    });
});

function updateLoginStatus() {
  const loginLi = document.querySelector('nav ul li a[href="./login.html"]');
  const token = localStorage.getItem("token");
  const banner = document.getElementById("edit-mode-banner");

  if (token) {
    loginLi.innerHTML = "logout";
    banner.style.display = "block";
    loginLi.addEventListener("click", logout);
  } else if (!token) {
    loginLi.textContent = "login";
    loginLi.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}

updateLoginStatus();

function logout() {
  localStorage.removeItem("token");
  updateLoginStatus();
  window.location.reload();
}
