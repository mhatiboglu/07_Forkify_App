import Search from "./modules/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
/*Global state of the app
--Search Object
--Current recipe object
-- Shopping List object
--Linked recipes
*/
const state = {};

const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput();
  //console.log(query);

  if (query) {
    //2. Create new search object and add the state
    state.search = new Search(query);
    //3. Prepare UI fore result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);
    //4. Search for recipes
    await state.search.getResult();

    //5. Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
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
    console.log(goToPage);
  }
});
