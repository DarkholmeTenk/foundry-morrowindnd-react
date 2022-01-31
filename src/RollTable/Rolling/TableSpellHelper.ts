import LoggerFactory from "../../Util/Logging"
import {RollData, RollTableArguments, TableHelper} from "./TableHelper";
import TableItemRollData from "./TableItemRollData";
import {loadPacks} from "../../Util/Identifiers/PackId";
import {SpellPackSetting} from "./Settings";

const log = LoggerFactory("TableSpellHelper")

export async function getAllSpells(): Promise<Item[]> {
	let packSpells = await loadPacks<Item>(SpellPackSetting.value)
	let byName: {[name: string]: Item} = {}
	packSpells.forEach(s=>byName[s.name || ""] = s)
	return Object.values(byName)
}

export default class TableSpellHelper implements TableHelper {
	async getRollData({args, filters, filterItem}: RollTableArguments): Promise<RollData[]> {
		log.debug("Getting random spell from pack", filters)
		let allResults = await getAllSpells()
		let filteredResults = allResults.filter(filterItem)
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