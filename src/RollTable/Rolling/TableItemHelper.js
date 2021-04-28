import TableItemRollData from "./TableItemRollData";
import { ItemPackSetting } from "./Settings";
import { loadPacks } from "../../Util/Identifiers/PackId";
export default class TableItemHelper {
    async getRollData({ filterItem }) {
        let packItems = await loadPacks(ItemPackSetting.value);
        let items = packItems.filter(filterItem);
        if (items.length > 0) {
            let randomIndex = Math.floor(Math.random() * items.length);
            return [new TableItemRollData(items[randomIndex])];
        }
        else {
            return [];
        }
    }
}
