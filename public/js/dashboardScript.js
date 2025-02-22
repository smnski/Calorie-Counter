document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-recipe").forEach(button => {
    button.addEventListener("click", async (event) => {
      const recipeId = event.target.getAttribute("data-id");

      const response = await fetch("/dashboard/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId })
      });

      const data = await response.json();
      if (data.success) {
        console.log("Meal added:", data.dayRecord);
      } else {
        console.error("Failed to add meal");
      }
    });
  });

  document.querySelector(".recipe-container").addEventListener("click", async (event) => {
    if (event.target.classList.contains("remove-meal")) {
      const mealId = event.target.getAttribute("data-id");

      try {
        const response = await fetch("/dashboard/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mealId })
        });

        const result = await response.json();

        if (result.success) {
          console.log("Meal removed.");
        } else {
          console.error("Failed to remove meal.", result.message);
        }
      } catch (err) {
        console.error("Failed to remove meal:", err);
      }
    }
  });

  socket.on("mealRemoved", (dayRecord) => {
    updateSummary(dayRecord);
  });
});
