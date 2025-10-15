// 🔹 Supabase Setup
const SUPABASE_URL = "https://ewnfzmbkeiwixvbfrtak.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bmZ6bWJrZWl3aXh2YmZydGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTIwODcsImV4cCI6MjA3NjAyODA4N30.WjEAiXfzTrt4NZdyQxdVpw7OAefxuwS5UAgvqejH4E0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const recipeContainer = document.getElementById("recipe-details");

// 🔹 Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

// If ID not found
if (!recipeId) {
  recipeContainer.innerHTML = `<p class="text-red-600 font-semibold">Recipe not found.</p>`;
}

// 🔹 Fetch recipe from Supabase
const loadRecipe = async () => {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, name, instructions, image_url, category_id, categories(name), ingredients(ingredient_name, measure)")
    .eq("id", recipeId)
    .single();

  if (error || !data) {
    console.error(error);
    recipeContainer.innerHTML = `<p class="text-red-600">Error loading recipe.</p>`;
    return;
  }

  // 🔹 Render recipe details
  recipeContainer.innerHTML = `
    <img src="${data.image_url}" alt="${data.name}" class="w-full md:w-1/2 rounded-2xl shadow-lg object-cover">

    <div class="flex-1">
      <h1 class="text-3xl font-bold text-[#819A91] mb-2">${data.name}</h1>
      <p class="text-sm text-gray-600 mb-4">${data.categories?.name || "Uncategorized"}</p>

      <h2 class="text-xl font-semibold mt-4 mb-2">Ingredients</h2>
      <ul class="list-disc ml-5 text-gray-700">
          ${data.ingredients.map(ing => `<li>${ing}</li>`).join("")}

      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Instructions</h2>
      <p class="text-gray-800 leading-relaxed">${data.instructions}</p>
    </div>
  `;
};

loadRecipe();
