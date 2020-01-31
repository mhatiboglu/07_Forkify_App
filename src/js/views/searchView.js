import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearResult = () => {
  elements.searchResList.innerHTML = "";
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};
export const clearInput = () => {
  elements.searchInput.value = "";
};
const renderRecipe = recipe => {
  const markup = `
    <li>
       <a class="likes__link" href="#${recipe.recipe_id}">
           <figure class="likes__fig">
               <img src="${recipe.image_url}" alt="${limitRecipeTitle(
    recipe.title
  )}">
           </figure>
           <div class="likes__data">
               <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
               <p class="likes__author">${recipe.publisher}</p>
           </div>
       </a>
   </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};
