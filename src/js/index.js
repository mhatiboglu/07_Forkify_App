import Search from "./modules/Search";
import Recipe from "./modules/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
/*Global state of the app
--Search Object
--Current recipe object
-- Shopping List object
--Linked recipes
*/
const state = {};

/*----------------- */
/*SEARCH CONTROLLER */
/*----------------- */

const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput();
  //console.log(query);

  //TESTINNG
  //const query = "pizza";

  if (query) {
    //2. Create new search object and add the state
    state.search = new Search(query);
    //3. Prepare UI fore result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);

    try {
      //4. Search for recipes
      await state.search.getResult();

      //5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log("Something wrong with the search!");
    }
  }
};
//we used preventDefault fot stop to refresh page;
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResult();
    searchView.renderResults(state.search.result, goToPage);
    //console.log(goToPage);
  }
});

/*----------------- */
/*RECIPE CONTROLLER */
/*----------------- */

const controlRecipe = async () => {
  //Get Id from url
  const id = window.location.hash.replace("#", "");

  if (id) {
    //prepera UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // create new recipe
    state.recipe = new Recipe(id);

    /////
    try {
      // get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
      //console.log(state.recipe);
    } catch (err) {
      alert("Error processing recipe!");
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach(event => {
  window.addEventListener(event, controlRecipe);
});
