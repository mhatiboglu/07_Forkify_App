import { elements, renderLoader } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearResult = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach(el => {
    el.classList.remove("results__link--active");
  });

  document
    .querySelector(`a[href="#${id}"]`)
    .classList.add("results__link--active");
};

export const limitRecipeTitle = (title, limit = 17) => {
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

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
        
    </button>`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    //button to go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    //both button
    button = `${createButton(page, "prev")} 
              ${createButton(page, "next")}`;
  } else if (page === pages && pages > 1) {
    //only prev button
    button = createButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
