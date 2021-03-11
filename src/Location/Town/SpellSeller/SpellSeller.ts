import {NPCData} from "../NPCs/NPCData";
import {getAllSpells} from "../../../RollTable/Rolling/TableSpellHelper";
import {calculatePrice} from "./SpellPrices";

interface SpellSchoolData {
    maxLevel: number
}

interface SpellSellerData {
    schools: {[school: string]: SpellSchoolData}
}

export class SpellSeller {
    constructor(private readonly data: SpellSellerData) {
    }

    private filterSpell(item: Item): boolean {
        let schoolData = this.data.schools[(item.data.data as any).school]
        let level = (item.data.data as any).level
        return schoolData && level <= schoolData.maxLevel && level > 0;
    }

    async getSellableSpells(): Promise<Item[]> {
        let spells = await getAllSpells()
        return spells.filter(x=>this.filterSpell(x))
    }

    getPrice(item: Item, self: Actor): number {
        let schoolData = this.data.schools[(item.data.data as any).school]
        let level = (item.data.data as any).level
        return calculatePrice(level, item, self)
    }

    toJSON() {
        return this.data
    }
}