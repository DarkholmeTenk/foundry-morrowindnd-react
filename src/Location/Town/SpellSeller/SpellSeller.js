import { getAllSpells } from "../../../RollTable/Rolling/TableSpellHelper";
import { calculatePrice } from "./SpellPrices";
export class SpellSeller {
    constructor(data) {
        this.data = data;
    }
    filterSpell(item) {
        let schoolData = this.data.schools[item.data.data.school];
        let level = item.data.data.level;
        return schoolData && level <= schoolData.maxLevel && level > 0;
    }
    async getSellableSpells() {
        let spells = await getAllSpells();
        return spells.filter(x => this.filterSpell(x));
    }
    getPrice(item, self) {
        let schoolData = this.data.schools[item.data.data.school];
        let level = item.data.data.level;
        return calculatePrice(level, item, self);
    }
    toJSON() {
        return this.data;
    }
}
