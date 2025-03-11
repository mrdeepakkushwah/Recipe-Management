document.addEventListener("DOMContentLoaded", () => {
  let signUpModalBtn = document.querySelector("#signup-modal-btn");
  let loginModalBtn = document.querySelector("#login-modal-btn");
  let signUpModal = document.querySelector("#signup-modal");
  let loginModal = document.querySelector("#login-modal");
  let closeSignUp = document.querySelector("#close-signup");
  let closeLogin = document.querySelector("#close-login");

  if (signUpModalBtn) {
    signUpModalBtn.addEventListener("click", () => {
      signUpModal.style.display = "block";
    });
  }

  if (loginModalBtn) {
    loginModalBtn.addEventListener("click", () => {
      loginModal.style.display = "block";
    });
  }

  if (closeSignUp) {
    closeSignUp.addEventListener("click", () => {
      signUpModal.style.display = "none";
    });
  }

  if (closeLogin) {
    closeLogin.addEventListener("click", () => {
      loginModal.style.display = "none";
    });
  }

  let signUpForm = document.querySelector("#signup-form");
  let loginForm = document.querySelector("#login-form");

  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let userName = document.querySelector("#name").value;
      let email = document.querySelector("#email-signup").value;
      let password = document.querySelector("#password-signup").value;

      let users = JSON.parse(localStorage.getItem("users")) || [];
      users.push({ userName, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Signup Done 😎! Please Login");
      signUpModal.style.display = "none";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let email = document.querySelector("#email-login").value;
      let password = document.querySelector("#password-login").value;

      let userDetail = JSON.parse(localStorage.getItem("users")) || [];
      let user = userDetail.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("loggedUser", email);
        alert("Login Successfully");
        window.location.href = "home.html";
      } else {
        alert("Invalid Email or Password");
      }
    });
  }

  let loggedInUser = localStorage.getItem("loggedUser");
  if (!loggedInUser && !window.location.href.includes("login.html")) {
    alert("Please Login To access this Page");
    window.location.href = "./login.html";
  }

  // logout;
  let logout = document.querySelector("#logout");
  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      alert("Logged Out Successfully");
      window.location.href = "./login.html";
    });
  }

  // Search and Display api data
  let searchInput = document.querySelector("#search-input");
  let searchBtn = document.querySelector("#search-btn");
  let resultBox = document.querySelector("#results");

  const fetchRecipes = async (query) => {
    try {
      resultBox.innerHTML = "<p>Loading Recipes...</p>";
      let api = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=cacd6a6c4feb46a7874a9d444a7666f9&addRecipeInformation=true`;

      const response = await fetch(api);
      const data = await response.json();
      console.log(data);

      resultBox.innerHTML = "";

      if (data.results && data.results.length > 0) {
        data.results.forEach((recipe) => {
          let recipeCard = document.createElement("div");
          recipeCard.innerHTML = `<img src="${recipe.image}" alt="Loading..."> <h3>${recipe.title}</h3> <p>Ready in ${recipe.readyInMinutes} minutes</p> <p>Servings:${recipe.servings}</p> <button>View Recipe</button> <button class = "bookmark-btn" >Bookmark</button>`;

          recipeCard
            .querySelector(".bookmark-btn")
            .addEventListener("click", () => {
              addToBookmark(recipe);
            });

          resultBox.appendChild(recipeCard);
        });
      } else {
        resultBox.innerHTML = "<p>No Recipes Found...</p>";
      }
    } catch (error) {
      console.log(error);
      resultBox.innerHTML = "<p>Failed to Fetch Recipes...</p>";
    }
  };
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      let query = searchInput.value.trim();
      if (query === "") {
        alert("Please Enter a Search Item");
        return;
      }
      fetchRecipes(query);
    });
  }

  const addToBookmark = (recipe) => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const bookmarksExists = bookmarks.find((items) => items.id === recipe.id);

    if (bookmarksExists) {
      alert("Recipe Already Bookmarked");
    } else {
      bookmarks.push({
        id: recipe.id,
        image: recipe.image,
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
      });
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      alert("Bookmarked Successfully !!!");
    }
  };

  const displayBookmarks = () => {
    let bookmarkContainer = document.querySelector("#bookmark-container");
    if (bookmarkContainer) {
      let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

      if (bookmarks.length === 0) {
        bookmarkContainer.innerHTML = "<p>No Bookmarked Recipe...</p>";
      }
      bookmarkContainer.innerHTML = "";
      bookmarks.forEach((bookmark) => {
        let bookmarkCard = document.createElement("div");
        bookmarkCard.innerHTML = `<img src="${bookmark.image}" alt="Loading..."> <h3>${bookmark.title}</h3> <p>Ready in ${bookmark.readyInMinutes}</p> <p>Servings:${bookmark.servings}</p> <button id="remove-bookmark-btn">Remove</button>`;

        bookmarkCard
          .querySelector("#remove-bookmark-btn")
          .addEventListener("click", () => {
            removeBookmarks(bookmark.id);
          });

        bookmarkContainer.appendChild(bookmarkCard);
      });
    }
  };

  const removeBookmarks = (id) => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    bookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    alert("Bookmark Removed");
    displayBookmarks();
  };

  if (window.location.href.includes("bookmark.html")) {
    displayBookmarks();
  }

  // User-recipe Page

  let addRecipeBtn = document.querySelector("#add-recipe-btn");
  let recipeFormSection = document.querySelector("#recipe-form-section");
  let cancelRecipeBtn = document.querySelector("#cancel-recipe-btn");
  let overlay = document.querySelector("#overlay");

  // Open Recipe Form Modal
  const openAddRecipeForm = () => {
    recipeFormSection.style.display = "block";
    overlay.style.display = "block";
  };
  if (addRecipeBtn) {
    addRecipeBtn.addEventListener("click", openAddRecipeForm);
  }

  // Close Recipe Form Modal
  const closeRecipeForm = () => {
    recipeFormSection.style.display = "none";
    overlay.style.display = "none";
  };

  if (cancelRecipeBtn) {
    cancelRecipeBtn.addEventListener("click", closeRecipeForm);
  }

  overlay.addEventListener("click", closeRecipeForm);

  // Create Recipe in User-Recipe Page
  let recipeForm = document.querySelector("#recipe-form");
  if (recipeForm) {
    recipeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let title = document.querySelector("#recipe-title").value;
      let description = document.querySelector("#recipe-description").value;
      let time = document.querySelector("#recipe-time").value;
      let servings = document.querySelector("#recipe-servings").value;
      let image = document.querySelector("#recipe-image").files[0];

      let newRecipe = {
        id: Date.now(),
        title,
        description,
        time,
        servings,
        image: URL.createObjectURL(image),
      };

      // Storing Recipe in local storage
      let recipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
      recipes.push(newRecipe);

      localStorage.setItem("userRecipes", JSON.stringify(recipes));
      // alert("Recipe Added Successfully");
      closeRecipeForm();
      displayUserRecipe();
    });
  }

  // Display Recipe in User-Recipe Page

  const displayUserRecipe = () => {
    let recipeList = document.querySelector("#recipe-list");
    recipeList.innerHTML = "";

    let userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];

    if (userRecipes.length === 0) {
      recipeList.innerHTML = "<p>No Recipe Found!!! </p> ";
    }

    userRecipes.forEach((recipe) => {
      let recipeCard = document.createElement("div");
      recipeCard.innerHTML = `<img src="${recipe.image}" alt="Loading..."> <h3>${recipe.title}</h3> <p> ${recipe.description}</p> <p>Ready in ${recipe.time} minutes</p> <p>Servings:${recipe.servings}</p>  <button>Update Recipe</button> <button class= "delete-btn" data-id="${recipe.id}">Delete Recipe</button> <button class = "bookmark-btn" data-id="${recipe.id}" >Bookmark</button>`;

      // bookmark
      recipeCard
        .querySelector(".bookmark-btn")
        .addEventListener("click", () => {
          addToBookmark(recipe);
        });

      // delete recipe

      recipeCard.querySelector(".delete-btn").addEventListener("click", () => {
        deleteRecipe(recipe.id);
      });

      recipeList.appendChild(recipeCard);
    });
  };

  // delete recipe
  const deleteRecipe = () => {
    let recipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    recipes = recipes.filter((recipe) => {
      recipe.id !== id;
    });
    localStorage.setItem("userRecipes", JSON.stringify(recipes))
    alert("Recipe Deleted Successfully");
    displayUserRecipe();
  };

  if (window.location.href.includes("user-recipe.html")) {
    displayUserRecipe();
  }
});
