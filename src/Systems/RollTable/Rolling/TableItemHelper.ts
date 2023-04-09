import {RollData, RollTableArguments, TableHelper} from "Systems/RollTable/Rolling/TableHelper";
import TableItemRollData from "Systems/RollTable/Rolling/TableItemRollData";
import {ItemPackSetting} from "Systems/RollTable/Rolling/Settings";
import {isItem} from "Util/Identifiers/UuidHelper";
import {loadPack} from "Util/Identifiers/PackHelper";

export default class TableItemHelper implements TableHelper {
	async getRollData({filterItem}: RollTableArguments): Promise<RollData[]> {
		let packItems = await loadPack(ItemPackSetting.value, isItem)
		let items = packItems.filter(filterItem)
		if(items.length > 0) {
			let randomIndex = Math.floor(Math.random() * items.length)
			return [new TableItemRollData(items[randomIndex])]
		} else {
			return [];
		}
	}
}