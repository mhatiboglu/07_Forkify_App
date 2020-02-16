import Search from "./modules/Search";
import Recipe from "./modules/Recipe";
import List from "./modules/List";
import Likes from "./modules/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/*Global state of the app
--Search Object
--Current recipe object
-- Shopping List object
--Linked recipes
*/
const state = {};
window.state = state;

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      //console.log(state.recipe);
    } catch (err) {
      console.log(err);
      alert("Error processing recipe!");
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach(event => {
  window.addEventListener(event, controlRecipe);
});

/*----------------- */
/*List CONTROLLER */
/*----------------- */

const controlList = () => {
  //Create a new list IF there is none yet
  if (!state.list) state.list = new List();
  //Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//handle delete and update list items event
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //handle delete
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //delete from state
    state.list.deleteItem(id);
    //delete from UI
    listView.deleteItem(id);
    //Handle the update count
  } else if (e.target.matches(".shopping__count-value")) {
    console.log("uydu");
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/*----------------- */
/*Like   CONTROLLER */
/*----------------- */
//TEST
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

//TEST

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  //user has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    //Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button
    likesView.toggleLikeBtn(true);
    //Add like to UI list
    console.log(state.likes);
    //user has liked current recipe
  } else {
    //Remove like from the state
    state.likes.deleteLike(currentID);
    //Toggle the like button
    likesView.toggleLikeBtn(false);

    //Remove like from UI list
    console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};
//handle recipe button clicks
elements.recipe.addEventListener("click", e => {
  // any click of button decrease or any child of btn-decrease
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrease btn click
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //increase btn clicked
    state.recipe.updateServings("inc----");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add * ")) {
    //Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //Like controller
    controlLike();
  }
  //console.log("state", state.recipe);
});

window.l = new List();
