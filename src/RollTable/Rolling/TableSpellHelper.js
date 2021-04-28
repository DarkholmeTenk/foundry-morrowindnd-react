import LoggerFactory from "../../Util/LoggerFactory";
import TableItemRollData from "./TableItemRollData";
import { loadPacks } from "../../Util/Identifiers/PackId";
import { SpellPackSetting } from "./Settings";
const log = LoggerFactory("TableSpellHelper");
export async function getAllSpells() {
    let packSpells = await loadPacks(SpellPackSetting.value);
    let byName = {};
    packSpells.forEach(s => byName[s.name] = s);
    return Object.values(byName);
}
export default class TableSpellHelper {
    async getRollData({ args, filters, filterItem }) {
        log.debug("Getting random spell from pack", filters);
        let allResults = await getAllSpells();
        let filteredResults = allResults.filter(filterItem);
        log.debug("Filtered spells", filters, filteredResults);
        let spellIndex = Math.floor(Math.random() * filteredResults.length);
        let spell = filteredResults[spellIndex];
        if (args.scroll) {
            spell = await spell.constructor.createScrollFromSpell(spell);
        }
        if (spell) {
            return [new TableItemRollData(spell)];
        }
        else {
            return [];
        }
    }
}
