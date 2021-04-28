// @ts-ignore
import { clone } from "@darkholme/foundry-react-core/src/Util/Util";
import { getEnchantData, getRandomCharge, isSpellEnchantable } from "../../Enchanting/Enchanter";
export default class TableItemRollData {
    constructor(item, qtyMult = 1) {
        this.item = item;
        this.qtyMult = qtyMult;
    }
    get isSpell() {
        return this.item.data.type === "spell";
    }
    applyItemModification(itemData) {
        if (isSpellEnchantable(itemData) && this.isSpell) {
            let charges = getRandomCharge();
            return getEnchantData({ itemData, charges, spellData: this.item.data });
        }
        else {
            return itemData;
        }
    }
    getItemData() {
        let newData = clone(this.item.data);
        let newItemData = {
            ...newData,
            data: {
                ...newData.data,
                quantity: (newData.data.quantity || 1) * this.qtyMult
            }
        };
        return [newItemData];
    }
    getModifications(actorData) {
        return {};
    }
    multiply(num) {
        if (this.isSpell) {
            return this;
        }
        else {
            return new TableItemRollData(this.item, this.qtyMult * num);
        }
    }
}
