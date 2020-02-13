import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }
  deleteItem(id) {
    //Find index with given id.
    const index = this.items.findIndex(el => el.id === id);
    //Delete with index
    this.items.splice(index, 1);
  }
  updateCount(id, newCount) {
    console.log("updatecount");
    //Find the item with id and change the count with given newCount
    this.items.find(el => el.id === id).count = newCount;
  }
}
