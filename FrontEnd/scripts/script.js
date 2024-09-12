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
    const token = localStorage.getItem("token");

    const filterMenu = document.createElement("div");
    filterMenu.className = "filter-menu";

    // Ajouter le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => displayWorks(works));
    filterMenu.appendChild(allButton);

    if (token) {
      allButton.style.display = "none";
    }

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
      if (token) {
        button.style.display = "none";
      }
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
  addModal();
}

updateLoginStatus();

function logout() {
  localStorage.removeItem("token");
  updateLoginStatus();
  window.location.reload();
}

function addModal() {
  const token = localStorage.getItem("token");
  const portfolio = document.getElementById("portfolio");

  if (token) {
    const h2 = portfolio.querySelector("h2");

    const divModifier = document.createElement("div");
    divModifier.textContent = "modifier";
    divModifier.classList.add("modifier");

    portfolio.insertBefore(divModifier, h2);

    divModifier.style.position = "absolute";
    divModifier.style.marginLeft = "10px";
    divModifier.style.background = "none";
    divModifier.style.border = "none";
    divModifier.style.color = "black";
    divModifier.style.cursor = "pointer";
    divModifier.style.fontSize = "14px";
    divModifier.style.top = "545px";
    divModifier.style.left = "950px";

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");
    icon.style.marginRight = "10px";

    divModifier.prepend(icon);

    divModifier.addEventListener("click", openModal);

    createModal();
  }
}

function displayWorksinModal(filteredWorks) {
  const modalGallery = document.querySelector(".modalGallery"); // Ensure modalGallery is selected
  modalGallery.innerHTML = ""; // Clear any previous content

  filteredWorks.forEach((work) => {
    const project = document.createElement("div"); // Create a container div for each work
    const img = document.createElement("img");

    img.src = work.imageUrl;
    img.alt = work.title;

    project.appendChild(img);
    modalGallery.appendChild(project);
  });
}

function createModal() {
  const modal = document.createElement("div");
  modal.id = "workModal";
  modal.className = "modal";
  modal.style.display = "none";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const closeBtn = document.createElement("span");
  closeBtn.className = "close";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal;

  const modalText = document.createElement("span");
  modalText.className = "modalText";
  modalText.textContent = "Galerie photo";

  const modalButton = document.createElement("button");
  modalButton.className = "modalButton";
  modalButton.textContent = "Ajouter une photo";

  const modalGallery = document.createElement("div");
  modalGallery.className = "modalGallery";

  const modalLine = document.createElement("span");
  modalLine.className = "modalLine";

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(modalText);
  modalContent.appendChild(modalGallery);
  modalContent.appendChild(modalLine);
  modalContent.appendChild(modalButton);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => displayWorksinModal(works));
}

function openModal() {
  const modal = document.getElementById("workModal");
  if (modal) {
    modal.style.display = "block";
  }
}

function closeModal() {
  const modal = document.getElementById("workModal");
  if (modal) {
    modal.style.display = "none";
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("workModal");
  if (event.target == modal) {
    closeModal();
  }
};
