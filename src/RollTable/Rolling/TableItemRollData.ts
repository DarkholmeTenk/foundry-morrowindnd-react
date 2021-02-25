import {RollData} from "./TableHelper";
// @ts-ignore
import {clone} from "@darkholme/foundry-react-core/src/Util/Util"
import {getEnchantData, getRandomCharge, isSpellEnchantable} from "../../Enchanting/Enchanter";

export default class TableItemRollData implements RollData {
    constructor(private readonly item: Item) {}

    applyItemModification(itemData: any): any {
        if(isSpellEnchantable(itemData) && this.item.data.type === "spell") {
            let charges = getRandomCharge()
            return getEnchantData({itemData, charges, spellData: this.item.data})
        } else {
            return itemData
        }
    }

    getItemData(): any[] {
        return [
            clone(this.item.data)
        ];
    }

    getModifications(actorData: any): { [p: string]: any } {
        return {};
    }

}