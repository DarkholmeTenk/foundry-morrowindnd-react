// @ts-ignore
import { clone } from "@darkholme/foundry-react-core/src/Util/Util";
import { getEnchantData, getRandomCharge, isSpellEnchantable } from "../../Enchanting/Enchanter";
export default class TableItemRollData {
    constructor(item) {
        this.item = item;
    }
    applyItemModification(itemData) {
        if (isSpellEnchantable(itemData) && this.item.data.type === "spell") {
            let charges = getRandomCharge();
            return getEnchantData({ itemData, charges, spellData: this.item.data });
        }
        else {
            return itemData;
        }
    }
    getItemData() {
        return [
            clone(this.item.data)
        ];
    }
    getModifications(actorData) {
        return {};
    }
}
