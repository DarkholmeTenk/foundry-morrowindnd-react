import {RollData} from "./TableHelper";
import {getEnchantData, getRandomCharge} from "Item/Enchanting/Enchanter";
import {isHoldable} from "Util/Helper/ItemHelper";


export default class TableItemRollData implements RollData {
    constructor(private readonly item: Item, private readonly qtyMult: number = 1) {}

    get isSpell() {
        return this.item.type === "spell"
    }

    applyItemModification(itemData: SmartItemData): any {
        let spellSource = this.item._source
        if(isHoldable(itemData) && spellSource.type == "spell") {
            let charges = getRandomCharge()
            return getEnchantData({itemData, charges, spellData: spellSource})
        } else {
            return itemData
        }
    }

    getItemData(): any[] {
        let newData = deepClone(this.item._source)
        let {system} = newData
        if("quantity" in system) {
            system.quantity = (system.quantity ?? 1) * this.qtyMult
        }
        return [newData];
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