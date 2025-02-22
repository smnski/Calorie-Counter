const socket = io();

socket.on("recipeAdded", data => {
  const recipesRow = document.querySelector(".row.g-4");
  const noRecipesElement = recipesRow.querySelector("p.text-center");
  if (noRecipesElement) noRecipesElement.closest(".col-12").remove();
  const newRecipeHtml = `<div class="col-md-4">
<div class="card card-container position-relative" id="recipe-${data._id}">
<div class="position-absolute top-0 end-0 d-flex">
<button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#editRecipeModal-${data._id}">
<i class="bi bi-pencil" style="font-size: 16px;"></i>
</button>
<button class="btn btn-lg me-2 remove-recipe" data-id="${data._id}">&times;</button>
</div>
<div class="card-body">
<h5 class="card-title">${data.name}</h5>
<p class="card-text">Calories: ${data.calories}</p>
<p class="card-text">Protein: ${data.protein}g</p>
<p class="card-text">Carbohydrates: ${data.carbohydrates}g</p>
<p class="card-text">Fats: ${data.fats}g</p>
</div>
</div>
</div>`;
  document.querySelector(".row.g-4").insertAdjacentHTML("beforeend", newRecipeHtml);
});

socket.on("recipeRemoved", id => {
  const recipesRow = document.querySelector(".row.g-4");
  const recipeElement = document.getElementById(`recipe-${id}`);
  if (recipeElement) {
    const colElement = recipeElement.closest(".col-md-4");
    if (colElement) colElement.remove();
  }
  if (recipesRow.querySelectorAll(".col-md-4").length === 0) {
    if (!recipesRow.querySelector("p.text-center")) {
      recipesRow.innerHTML = `<div class="col-12"><p class="text-center">No recipes found!</p></div>`;
    }
  }
});

socket.on("recipeEdited", data => {
  const recipeElement = document.getElementById(`recipe-${data._id}`);
  if (recipeElement) {
    recipeElement.querySelector(".card-title").textContent = data.name;
    recipeElement.querySelectorAll(".card-text")[0].textContent = `Calories: ${data.calories}`;
    recipeElement.querySelectorAll(".card-text")[1].textContent = `Protein: ${data.protein}g`;
    recipeElement.querySelectorAll(".card-text")[2].textContent = `Carbohydrates: ${data.carbohydrates}g`;
    recipeElement.querySelectorAll(".card-text")[3].textContent = `Fats: ${data.fats}g`;
  }
});

socket.on("recipesFiltered", data => {
  const recipesRow = document.querySelector(".row.g-4");
  recipesRow.innerHTML = "";
  if (data.length > 0) {
    data.forEach(recipe => {
      const recipeHtml = `<div class="col-md-4">
<div class="card card-container position-relative" id="recipe-${recipe._id}">
<div class="position-absolute top-0 end-0 d-flex">
<button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#editRecipeModal-${recipe._id}">
<i class="bi bi-pencil" style="font-size: 16px;"></i>
</button>
<button class="btn btn-lg me-2 remove-recipe" data-id="${recipe._id}">&times;</button>
</div>
<div class="card-body">
<h5 class="card-title">${recipe.name}</h5>
<p class="card-text">Calories: ${recipe.calories}</p>
<p class="card-text">Protein: ${recipe.protein}g</p>
<p class="card-text">Carbohydrates: ${recipe.carbohydrates}g</p>
<p class="card-text">Fats: ${recipe.fats}g</p>
</div>
</div>
</div>`;
      recipesRow.insertAdjacentHTML("beforeend", recipeHtml);
    });
  } else {
    recipesRow.innerHTML = `<div class="col-12"><p class="text-center">No recipes found!</p></div>`;
  }
});
