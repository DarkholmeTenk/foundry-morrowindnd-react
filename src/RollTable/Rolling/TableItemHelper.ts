import {RollData, RollTableArguments, TableHelper} from "./TableHelper";
import TableItemRollData from "./TableItemRollData";
import {ItemPackSetting} from "./Settings";
import {loadPacks} from "../../Util/Identifiers/PackId";

export default class TableItemHelper implements TableHelper {
	async getRollData({filterItem}: RollTableArguments): Promise<RollData[]> {
		let packItems = await loadPacks<Item5e>(ItemPackSetting.value)
		let items = packItems.filter(filterItem)
		if(items.length > 0) {
			let randomIndex = Math.floor(Math.random() * items.length)
			return [new TableItemRollData(items[randomIndex])]
		} else {
			return [];
		}
	}
}