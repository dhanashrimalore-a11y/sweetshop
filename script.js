const searchBox=document.querySelector('.searchBox');
const searchBtn=document.querySelector('.searchBtn');
const recipeContainer=document.querySelector('.recipe-container');
const recipeDetailsContent=document.querySelector('.recipe-details-content');
const recipeCloseBtn=document.querySelector('.recipe-close-btn');


//Function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes....</h2>"; // clear old results

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

 if (!response.meals) {
        recipeContainer.innerHTML = '<p>No recipes found</p>';
        return;
    }



     recipeContainer.innerHTML="";
     response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML =
         `<img src="${meal.strMealThumb}">
          <h3>${meal.strMeal}</h3>
          <p><span>${meal.strArea}</span>Dish</p>
          <p>Belongs to <span>${meal.strCategory}</span>Dish</p>
          `
        const button=document.createElement('button');
        button.textContent="View Recipe";
        recipeDiv.appendChild(button);

        //Adding EventListener to recipe button
        button.addEventListener('click',()=>{
               openRecipePopup(meal);
            
            
            })
         recipeContainer.appendChild(recipeDiv);
    });
}


const recipeDetails = document.querySelector('.recipe-details');

  const openRecipePopup = (meal) => {
  const ingredientsList = fetchIngredients(meal);

  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${ingredientsList}</ul>
    <div class="instructions">
      <h3>Instructions:</h3>
      <p class="recipeInstructions">${meal.strInstructions || ''}</p>
    </div>
  `;
  recipeDetails.style.display = 'block';
};


// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredientsList += `<li>${measure ? measure : ""} ${ingredient}</li>`;
        }
        else{
            break;
        }
    }
      return ingredientsList;                                                                                    
};
   
recipeCloseBtn.addEventListener('click', () => {
  recipeDetails.style.display = 'none';
});
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const searchInput = searchBox.value.trim();

    if (!searchInput) {
        recipeContainer.innerHTML = "<h2>Type a meal name.</h2>";
        return;
    }

    fetchRecipes(searchInput);
});