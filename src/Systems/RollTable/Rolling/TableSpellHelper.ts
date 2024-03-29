import LoggerFactory from "Util/Logging"
import {RollData, RollTableArguments, TableHelper} from "Systems/RollTable/Rolling/TableHelper";
import TableItemRollData from "Systems/RollTable/Rolling/TableItemRollData";
import {SpellPackSetting} from "Systems/RollTable/Rolling/Settings";
import {loadPack} from "Util/Identifiers/PackHelper";
import {isSpell} from "Constants/SpellConstants";

const log = LoggerFactory("TableSpellHelper")

export async function getAllSpells(): Promise<Item[]> {
	let packSpells = await loadPack(SpellPackSetting.value, isSpell)
	let byName: {[name: string]: Item} = {}
	packSpells.forEach(s=>byName[s.name || ""] = s)
	return Object.values(byName)
}

export default class TableSpellHelper implements TableHelper {
	async getRollData({args, filters, filterItem}: RollTableArguments): Promise<RollData[]> {
		log.debug("Getting random spell from pack", filters)
		let allResults = await getAllSpells()
		let filteredResults = allResults.filter(filterItem)
		if(filteredResults.length == 0) {
			log.error("Table spells has produced no results")
			return []
		}
		log.debug("Filtered spells", filters, filteredResults)
		let spellIndex = Math.floor(Math.random() * filteredResults.length)
		let spell = filteredResults[spellIndex]
		if(args.scroll) {
			spell = await (spell.constructor as any).createScrollFromSpell(spell)
		}
		if(spell) {
			return [new TableItemRollData(spell)]
		} else {
			return [];
		}
	}
}