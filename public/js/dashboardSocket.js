const socket = io();

socket.on("mealRemoved", async (dayRecord) => {
  try {
    const response = await fetch("/dashboard");
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const updatedMeals = doc.querySelector(".recipe-container");

    if (updatedMeals) {
      document.querySelector(".recipe-container").innerHTML = updatedMeals.innerHTML;
    }

    updateSummary(dayRecord);
  } catch (error) {
    console.error("Error updating meals:", error);
  }
});

socket.on("mealAdded", async (dayRecord) => {
  try {
    const response = await fetch("/dashboard");
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const updatedMeals = doc.querySelector(".recipe-container");

    if (updatedMeals) {
      document.querySelector(".recipe-container").innerHTML = updatedMeals.innerHTML;
    }

    updateSummary(dayRecord);
  } catch (error) {
    console.error("Error updating meals:", error);
  }
});

function updateSummary(dayRecord) {
  const calorieSummary = document.getElementById("calorieSummary");
  const proteinSummary = document.getElementById("proteinSummary");
  const fatsSummary = document.getElementById("fatsSummary");
  const carbsSummary = document.getElementById("carbsSummary");

  if (dayRecord.consumedCalories > 0) {
    calorieSummary.innerHTML = `<strong>Consumed:</strong> ${dayRecord.consumedCalories} kcal`;
  } else {
    calorieSummary.innerHTML = `<p style="color: grey;" class="summary-text">No data</p>`;
  }

  if (dayRecord.consumedProtein > 0) {
    proteinSummary.innerHTML = `<strong>Protein:</strong> ${dayRecord.consumedProtein} g`;
  } else {
    proteinSummary.innerHTML = `<p id="proteinSummary" class="summary-text"><strong>Protein:</strong> No data</p>`;
  }

  if (dayRecord.consumedCarbohydrates > 0) {
    carbsSummary.innerHTML = `<strong>Carbohydrates:</strong> ${dayRecord.consumedCarbohydrates} g`;
  } else {
    carbsSummary.innerHTML = `<p id="carbsSummary" class="summary-text"><strong>Carbohydrates:</strong> No data</p>`;
  }

  if (dayRecord.consumedFats > 0) {
    fatsSummary.innerHTML = `<strong>Fats:</strong> ${dayRecord.consumedFats} g`;
  } else {
    fatsSummary.innerHTML = `<p id="fatsSummary" class="summary-text"><strong>Fats:</strong> No data</p>`;
  }
}
