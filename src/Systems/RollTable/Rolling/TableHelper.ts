import LoggerFactory from "Util/Logging"
import TableSpellHelper from "./TableSpellHelper"
import TableGoldHelper from "./TableGoldHelper"
import {parseArguments} from "./tableHelperUtils"
import TableItemHelper from "./TableItemHelper"
import TableWeaponEnchantHelper from "./TableWeaponEnchantHelper"
import TableItemRollData from "./TableItemRollData";
import TableTableHelper from "./TableTableHelper";

const log = LoggerFactory("TableHelper")

export enum RollType {
	TEXT = 0,
	DOCUMENT = 1,
	COMPENDIUM = 2
}

export interface RollData  {
	getModifications(actorData: any): {[field: string]: any}

	getItemData(): any[]

	applyItemModification(itemData: any): any

	multiply(num: number): RollData
}

export interface RollTableArguments {
	args: {[name: string]: string}
	filters: {
		field: string,
		compareFunction: (value: string, data: any)=>boolean
	},
	filterItem: (item: Item)=>boolean
}

export interface TableHelper {
	getRollData(args: RollTableArguments): Promise<RollData[]>
}

const TextHelpers: {[name: string]: TableHelper} = {
	"@Gold": new TableGoldHelper(),
	"@Item": new TableItemHelper(),
	"@Spells": new TableSpellHelper(),
	"@Table": new TableTableHelper(),
	"@WeaponEnchant": new TableWeaponEnchantHelper()
}

export function getArguments(text: string): RollTableArguments {
	let results = text.match(/\[([^\]]+)]/g)?.map(t=>t.substr(1, t.length - 2)) || []
	log.debug("Found roll helper arguments", results, text)
	return parseArguments(results) as any as RollTableArguments
}

export async function getRollTableData(result: RealTableResult): Promise<RollData[]> {
	log.debug("Getting roll item", arguments)
	if(result.type == RollType.TEXT) {
		let text = result.text
		let call = text.split(/\s/,1)[0]
		let helper = TextHelpers[call]
		if(helper) {
			let filters = getArguments(text)
			let result = await helper.getRollData(filters)
			log.debug("Found result", result)
			return result
		} else {
			return []
		}
	} else if(result.type == RollType.DOCUMENT) {
		if(result.documentCollection === "Item") {
			let item = game.items.get(result.documentId)
			if(item) return [new TableItemRollData(item)]
		}
	} else if(result.type == RollType.COMPENDIUM) {
		let pack = game.packs.get(result.documentCollection)
		let item: DocumentBase | undefined = await pack?.getDocument(result.documentId)
		if(item && item instanceof Item) return [new TableItemRollData(item)]
	} else {
		log.error("Somehow we got the wrong type", arguments)
		return []
	}
	return []
}