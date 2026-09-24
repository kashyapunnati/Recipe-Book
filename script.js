let recipes = [];
let editingId = null;

const recipeName = document.getElementById("recipeName");
const recipeCategory = document.getElementById("recipeCategory");
const ingredients = document.getElementById("ingredients");
const instructions = document.getElementById("instructions");

const saveRecipeBtn = document.getElementById("saveRecipeBtn");
const categoryFilter = document.getElementById("categoryFilter");
const recipeList = document.getElementById("recipeList");

const recipeDetails = document.getElementById("recipeDetails");
const detailName = document.getElementById("detailName");
const detailCategory = document.getElementById("detailCategory");
const detailIngredients = document.getElementById("detailIngredients");
const detailInstructions = document.getElementById("detailInstructions");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");

const savedRecipes = localStorage.getItem("recipes");

if (savedRecipes) {
    recipes = JSON.parse(savedRecipes);
}

displayRecipes();

saveRecipeBtn.addEventListener("click", function () {

    const name = recipeName.value.trim();
    const category = recipeCategory.value;
    const ingredientText = ingredients.value.trim();
    const instructionText = instructions.value.trim();

    if (
        name === "" ||
        category === "" ||
        ingredientText === "" ||
        instructionText === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    if (editingId !== null) {

        const recipe = recipes.find(function (item) {
            return item.id === editingId;
        });

        recipe.name = name;
        recipe.category = category;
        recipe.ingredients = ingredientText;
        recipe.instructions = instructionText;

        editingId = null;
        saveRecipeBtn.textContent = "Add Recipe";

        alert("Recipe updated successfully!");

    } else {

        const newRecipe = {
            id: Date.now(),
            name: name,
            category: category,
            ingredients: ingredientText,
            instructions: instructionText
        };

        recipes.push(newRecipe);

        alert("Recipe added successfully!");
    }

    saveToLocalStorage();
    clearForm();
    displayRecipes();
});

function displayRecipes() {

    recipeList.innerHTML = "";

    const selectedCategory = categoryFilter.value;

    let filteredRecipes = recipes;

    if (selectedCategory !== "All") {
        filteredRecipes = recipes.filter(function (recipe) {
            return recipe.category === selectedCategory;
        });
    }

    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    filteredRecipes.forEach(function (recipe) {

        const card = document.createElement("div");

        card.className = "recipe-card";

        card.innerHTML = `
            <h3>${recipe.name}</h3>

            <span class="recipe-category">
                ${recipe.category}
            </span>

            <br>

            <button class="view-btn"
                onclick="viewRecipe(${recipe.id})">
                View
            </button>

            <button class="edit-btn"
                onclick="editRecipe(${recipe.id})">
                Edit
            </button>

            <button class="delete-btn"
                onclick="deleteRecipe(${recipe.id})">
                Delete
            </button>
        `;

        recipeList.appendChild(card);
    });
}

function viewRecipe(id) {

    const recipe = recipes.find(function (item) {
        return item.id === id;
    });

    if (!recipe) {
        return;
    }

    detailName.textContent = recipe.name;
    detailCategory.textContent = recipe.category;
    detailIngredients.textContent = recipe.ingredients;
    detailInstructions.textContent = recipe.instructions;

    recipeDetails.style.display = "block";

    recipeDetails.scrollIntoView({
        behavior: "smooth"
    });
}

function editRecipe(id) {

    const recipe = recipes.find(function (item) {
        return item.id === id;
    });

    if (!recipe) {
        return;
    }

    recipeName.value = recipe.name;
    recipeCategory.value = recipe.category;
    ingredients.value = recipe.ingredients;
    instructions.value = recipe.instructions;

    editingId = id;

    saveRecipeBtn.textContent = "Update Recipe";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteRecipe(id) {

    const recipe = recipes.find(function (item) {
        return item.id === id;
    });

    if (!recipe) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${recipe.name}"?`
    );

    if (!confirmed) {
        return;
    }

    recipes = recipes.filter(function (item) {
        return item.id !== id;
    });

    saveToLocalStorage();
    displayRecipes();

    alert("Recipe deleted successfully!");
}

categoryFilter.addEventListener("change", function () {
    displayRecipes();
});

closeDetailsBtn.addEventListener("click", function () {
    recipeDetails.style.display = "none";
});

function saveToLocalStorage() {

    localStorage.setItem(
        "recipes",
        JSON.stringify(recipes)
    );
}

function clearForm() {

    recipeName.value = "";
    recipeCategory.value = "";
    ingredients.value = "";
    instructions.value = "";
}