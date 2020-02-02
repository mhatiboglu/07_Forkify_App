import axios from "axios";
import { proxy } from "../config";
export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
      this.url = res.data.recipe.source_url;
    } catch (error) {
      console.log(error);
    }
  }
  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
}
