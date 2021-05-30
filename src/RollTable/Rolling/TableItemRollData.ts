import {RollData} from "./TableHelper";
// @ts-ignore
import {clone} from "../../Util"
import {getEnchantData, getRandomCharge, isSpellEnchantable} from "../../Item/Enchanting/Enchanter";

export default class TableItemRollData implements RollData {
    constructor(private readonly item: Item, private readonly qtyMult: number = 1) {}

    get isSpell() {
        return this.item.data.type === "spell"
    }

    applyItemModification(itemData: any): any {
        if(isSpellEnchantable(itemData) && this.isSpell) {
            let charges = getRandomCharge()
            return getEnchantData({itemData, charges, spellData: this.item.data})
        } else {
            return itemData
        }
    }

    getItemData(): any[] {
        let newData = clone(this.item.data)
        let newItemData = {
            ...newData,
            data: {
                ...newData.data,
                quantity: (newData.data.quantity || 1) * this.qtyMult
            }
        }
        return [newItemData];
    }

    getModifications(actorData: any): { [p: string]: any } {
        return {};
    }

    multiply(num: number): RollData {
        if(this.isSpell) {
            return this
        } else {
            return new TableItemRollData(this.item, this.qtyMult * num)
        }
    }
}