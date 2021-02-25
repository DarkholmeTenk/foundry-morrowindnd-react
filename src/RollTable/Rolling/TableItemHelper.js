import TableItemRollData from "./TableItemRollData";
export default class TableItemHelper {
    async getRollData({ filterItem }) {
        let items = game.items.filter(filterItem);
        if (items.length > 0) {
            let randomIndex = Math.floor(Math.random() * items.length);
            return [new TableItemRollData(items[randomIndex])];
        }
        else {
            return [];
        }
    }
}
