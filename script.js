// 🔹 Supabase Setup
const SUPABASE_URL = "https://ewnfzmbkeiwixvbfrtak.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bmZ6bWJrZWl3aXh2YmZydGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTIwODcsImV4cCI6MjA3NjAyODA4N30.WjEAiXfzTrt4NZdyQxdVpw7OAefxuwS5UAgvqejH4E0";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const searchbox = document.getElementById("SearchBox");
const searchbtn = document.getElementById("SearchBtn");
const recipecontainer = document.querySelector(".recipe-container");

// 🔹 Fetch recipes from Supabase (by name)
const fetchrecipes = async (query) => {
  recipecontainer.innerHTML = ""; // clear old results

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("id, name, instructions, image_url, category_id, categories(name)")
    .ilike("name", `%${query}%`);

  if (error) {
    console.error(error);
    recipecontainer.innerHTML = "<p class='text-red-500'>Error fetching recipes.</p>";
    return;
  }

  // No results
  if (!recipes || recipes.length === 0) {
    recipecontainer.innerHTML = "<p class='text-gray-600'>No recipes found.</p>";
    return;
  }

  // 🔹 Render recipes as cards
  recipes.forEach((meal) => {
    const card = document.createElement("div");
    card.className =
      "relative group cursor-pointer overflow-hidden h-72 w-56 rounded-2xl shadow-md";

    card.innerHTML = `
      <img src="${meal.image_url}" alt="${meal.name}" class="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110">
      <div class="absolute bg-gray-50/95 -bottom-28 w-full p-3 flex flex-col gap-1 group-hover:bottom-0 transition-all duration-500 rounded-b-2xl">
        <span class="text-[#819A91] font-bold text-xs">${meal.categories?.name || "Unknown"}</span>
        <span class="text-[#819A92] font-bold text-lg truncate">${meal.name}</span>
        <a href="recipe.html?id=${meal.id}" target="_blank" class="text-[#EEEFE0] bg-[#A7C1A8] text-sm mt-1 font-semibold px-3 py-1 rounded-md w-fit hover:bg-[#819A91] transition-all duration-300">
          View Recipe →
        </a>
      </div>
    `;
    

    recipecontainer.appendChild(card);
  });
};

// 🔹 Search button event
searchbtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchbox.value.trim();
  if (searchInput) fetchrecipes(searchInput);
});
