document.addEventListener("DOMContentLoaded", function () {
  let works = [];
  let categories = [];

  function displayWorks(filteredWorks) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    filteredWorks.forEach((work) => {
      const project = document.createElement("project");
      project.dataset.id = work.id;
      const img = document.createElement("img");
      const imgTitle = document.createElement("imgTitle");

      img.src = work.imageUrl;
      img.alt = work.title;
      imgTitle.textContent = work.title;

      project.appendChild(img);
      project.appendChild(imgTitle);
      gallery.appendChild(project);
    });

    console.log("Fetched categories data:", categories);
  }

  function createFilterMenu(categories) {
    const token = localStorage.getItem("token");

    const filterMenu = document.createElement("div");
    filterMenu.className = "filter-menu";

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => displayWorks(works));
    filterMenu.appendChild(allButton);

    if (token) {
      allButton.style.display = "none";
    }

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

    const portfolio = document.getElementById("portfolio");
    portfolio.insertBefore(filterMenu, document.querySelector(".gallery"));
  }

  Promise.all([
    fetch("http://localhost:5678/api/works").then((response) =>
      response.json()
    ),
    fetch("http://localhost:5678/api/categories").then((response) =>
      response.json()
    ),
  ])
    .then(([worksData, categoriesData]) => {
      works = worksData;
      categories = categoriesData;
      console.log("Fetched categories data:", categories);
      displayWorks(works);
      createFilterMenu(categories);
      createAddModal();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  function updateLoginStatus() {
    const loginLi = document.querySelector('nav ul li a[href="./login.html"]');
    const token = localStorage.getItem("token");
    const banner = document.getElementById("edit-mode-banner");

    if (token) {
      loginLi.innerHTML = "logout";
      banner.style.display = "block";

      loginLi.addEventListener("click", logout);
    } else {
      loginLi.textContent = "login";
    }
    addModal();
  }

  updateLoginStatus();

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    updateLoginStatus();
    window.location.href = "./index.html";
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
    const modalGallery = document.querySelector(".modalGallery");
    modalGallery.innerHTML = "";

    filteredWorks.forEach((work) => {
      const project = document.createElement("div");
      project.className = "modal-project";
      project.style.position = "relative";
      project.dataset.id = work.id;

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fa-solid fa-trash-can delete-icon";
      deleteIcon.style.position = "absolute";
      deleteIcon.style.top = "5px";
      deleteIcon.style.right = "5px";
      deleteIcon.style.color = "white";
      deleteIcon.style.cursor = "pointer";

      deleteIcon.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        deleteProject(work.id);
      });

      project.appendChild(img);
      project.appendChild(deleteIcon);
      modalGallery.appendChild(project);
    });
  }

  function deleteProject(projectId) {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found. User must be logged in to delete projects."
      );
      return;
    }

    fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please check your login status");
          } else {
            throw new Error("Failed to delete project");
          }
        }
        works = works.filter((work) => work.id !== projectId);

        const modalProject = document.querySelector(
          `.modalGallery .modal-project[data-id="${projectId}"]`
        );
        if (modalProject) {
          modalProject.remove();
        }

        const galleryProject = document.querySelector(
          `.gallery project[data-id="${projectId}"]`
        );
        if (galleryProject) {
          galleryProject.remove();
        }

        console.log(`Project ${projectId} deleted successfully`);
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
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
    modalButton.onclick = openAddModal;

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

    createAddModal();

    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((works) => displayWorksinModal(works));
  }

  function createAddModal() {
    const addModal = document.createElement("div");
    addModal.id = "addModal";
    addModal.className = "modal";
    addModal.style.display = "none";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = closeAddModal;

    const backBtn = document.createElement("span");
    backBtn.className = "back";
    backBtn.innerHTML = "&#8592;";
    backBtn.onclick = () => {
      closeAddModal();
      openModal();
    };
    const modalLine = document.createElement("span");
    modalLine.className = "modalLine";

    const modalText = document.createElement("h2");
    modalText.textContent = "Ajout photo";

    const form = document.createElement("form");
    form.id = "addWorkForm";

    const uploadWrapper = document.createElement("div");
    uploadWrapper.classList.add("upload-wrapper");

    const imageUploadIcon = document.createElement("i");
    imageUploadIcon.className = "fa-regular fa-image upload-icon";
    uploadWrapper.append(imageUploadIcon);

    const imageUploadLabel = document.createElement("label");
    imageUploadLabel.htmlFor = "image";
    imageUploadLabel.innerText = "+ Ajouter photo";
    imageUploadLabel.classList.add("upload-label");
    uploadWrapper.append(imageUploadLabel);

    const imageUpload = document.createElement("input");
    imageUpload.type = "file";
    imageUpload.id = "image";
    imageUpload.name = "image";
    imageUpload.accept = "image/*";
    imageUpload.required = true;
    imageUpload.classList.add("upload-image");
    uploadWrapper.append(imageUpload);

    const imageIndication = document.createElement("div");
    imageIndication.innerText = "jpg.png : 4mo max";
    imageIndication.classList.add("upload-indication");
    uploadWrapper.appendChild(imageIndication);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title";
    titleInput.name = "title";
    titleInput.required = true;

    const categorySelect = document.createElement("select");
    categorySelect.id = "category";
    categorySelect.name = "category";
    categorySelect.required = true;

    const submitBtn = document.createElement("button");
    submitBtn.className = "submitBtn";
    submitBtn.type = "submit";
    submitBtn.textContent = "Valider";

    const categoryTitle = document.createElement("span");
    categoryTitle.className = "categoryTitle";
    categoryTitle.textContent = "Catégorie";

    const titreTitle = document.createElement("span");
    titreTitle.className = "titreTitle";
    titreTitle.textContent = "Titre";

    form.appendChild(uploadWrapper);
    form.appendChild(titleInput);
    form.appendChild(categorySelect);
    form.appendChild(submitBtn);

    form.onsubmit = handleAddWork;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      imageUpload.value = "";
      titleInput.value = "";
      categorySelect.selectedIndex = null;
    });

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(backBtn);
    modalContent.appendChild(modalText);
    modalContent.appendChild(form);
    modalContent.appendChild(modalLine);
    modalContent.appendChild(categoryTitle);
    modalContent.appendChild(titreTitle);

    addModal.appendChild(modalContent);
    document.body.appendChild(addModal);

    populateCategoryDropdown(categorySelect);
  }

  function populateCategoryDropdown(selectElement) {
    Promise.all([
      fetch("http://localhost:5678/api/categories").then((response) =>
        response.json()
      ),
    ])
      .then(([categories]) => {
        console.log(categories);
        selectElement.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        if (categories.length === 0) {
          console.warn("No categories available to populate.");
        }

        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id; // Set category ID as value
          option.textContent = category.name; // Set category name as text
          selectElement.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function openModal() {
    const modal = document.getElementById("workModal");
    if (modal) {
      modal.style.display = "block";
    }
    closeAddModal();
  }

  function closeModal() {
    const modal = document.getElementById("workModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  function openAddModal() {
    closeModal();
    const addModal = document.getElementById("addModal");
    if (addModal) {
      addModal.style.display = "block";
    }
  }

  function closeAddModal() {
    const addModal = document.getElementById("addModal");
    if (addModal) {
      addModal.style.display = "none";
    }
  }

  function handleAddWork(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User must be logged in to add projects.");
      return;
    }

    const formData = new FormData(event.target);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add project");
        }
        return response.json();
      })
      .then((newWork) => {
        works.push(newWork);
        displayWorks(works);
        displayWorksinModal(works);
        closeAddModal();
        openModal();
      })
      .catch((error) => {
        console.error("Error adding project:", error);
      });
  }

  window.onclick = function (event) {
    const modal = document.getElementById("workModal");
    const addModal = document.getElementById("addModal");
    if (event.target == modal) {
      closeModal();
    }
    if (event.target == addModal) {
      closeAddModal();
    }
  };
});
