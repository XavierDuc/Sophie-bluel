document.addEventListener("DOMContentLoaded", function () {
  let works = []; // Pour stocker tous les travaux

  // Fonction pour afficher les travaux filtrés
  function displayWorks(filteredWorks) {
    const gallery = document.querySelector(".gallery");

    filteredWorks.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
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

let login = document.querySelectorAll(".login");
login.addEventListener("click", (event) => {
  console.log("login cliqué");
});
