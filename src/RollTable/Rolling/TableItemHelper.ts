import {RollData, RollTableArguments, TableHelper} from "./TableHelper";
import TableItemRollData from "./TableItemRollData";

export default class TableItemHelper implements TableHelper {
	async getRollData({filterItem}: RollTableArguments): Promise<RollData[]> {
		let items = game.items.filter(filterItem)
		if(items.length > 0) {
			let randomIndex = Math.floor(Math.random() * items.length)
			return [new TableItemRollData(items[randomIndex])]
		} else {
			return [];
		}
	}
}