document.addEventListener("DOMContentLoaded", () => {
  const addRecipeForm = document.querySelector("#addRecipeModal form");

  addRecipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(addRecipeForm);
    const recipeData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/recipes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      const result = await response.json();
      if (result.success) {
        const modal = bootstrap.Modal.getInstance(document.querySelector("#addRecipeModal"));
        modal.hide();
        addRecipeForm.reset();
      }
    } catch (err) {
      console.error("Error adding recipe:", err);
    }
  });

  document.querySelector(".container").addEventListener("click", async (event) => {
    if (event.target.classList.contains("remove-recipe")) {
      const recipeId = event.target.getAttribute("data-id");

      try {
        const response = await fetch("/recipes/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId }),
        });

        const result = await response.json();
        if (result.success) {
          document.querySelector(`#recipe-${recipeId}`).remove();
        }
      } catch (err) {
        console.error("Error deleting recipe:", err);
      }
    }
  });

  document.querySelectorAll("[id^='editRecipeModal-'] form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const recipeId = form.closest(".modal").id.replace("editRecipeModal-", "");
      const formData = new FormData(form);
      const updatedData = Object.fromEntries(formData.entries());
      try {
        const response = await fetch(`/recipes/edit/${recipeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        const result = await response.json();
        if (result.success) {
          const modal = bootstrap.Modal.getInstance(form.closest(".modal"));
          modal.hide();
        }
      } catch (err) {
        console.error("Error editing recipe:", err);
      }
    });
  });

  document.querySelector("#filterRecipesModal form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.querySelector("#filterRecipesModal form");
    const formData = new FormData(form);
    const filterData = Object.fromEntries(formData.entries());
    const queryParams = new URLSearchParams(filterData).toString();
    try {
      const response = await fetch(`/recipes/filter?${queryParams}`, {
        method: "GET",
      });
      const result = await response.json();
      if (result.success) {
        const modal = bootstrap.Modal.getInstance(document.querySelector("#filterRecipesModal"));
        modal.hide();
      }
    } catch (err) {
      console.error("Error filtering recipes:", err);
    }
  });
});
