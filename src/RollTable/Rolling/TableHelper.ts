import LoggerFactory from "../../Util/Logging"
import TableSpellHelper from "./TableSpellHelper"
import TableGoldHelper from "./TableGoldHelper"
import {parseArguments} from "./tableHelperUtils"
import TableItemHelper from "./TableItemHelper"
import TableWeaponEnchantHelper from "./TableWeaponEnchantHelper"
import TableItemRollData from "./TableItemRollData";
import TableTableHelper from "./TableTableHelper";
import {TABLE_RESULT_TYPES} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs";

const log = LoggerFactory("TableHelper")

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

export function getArguments(text): RollTableArguments {
	let results = text.match(/\[([^\]]+)\]/g)?.map(text=>text.substr(1, text.length - 2)) || []
	log.debug("Found roll helper arguments", results, text)
	return parseArguments(results) as any as RollTableArguments
}

export async function getRollTableData({type, text, resultId, collection}: {type: TABLE_RESULT_TYPES, text?: string, resultId?: string, collection?: string}): Promise<RollData[]> {
	log.debug("Getting roll item", arguments)
	if(type == 0) {
		text = text!
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
	} else if(type == 1) {
		resultId = resultId!
		return [new TableItemRollData(game.items!.get(resultId)!)]
	} else if(type == 2) {
		collection = collection!
		resultId = resultId!
		let pack = game.packs.get(collection)
		return [new TableItemRollData((await pack!.getDocument(resultId))! as Item)]
	} else {
		log.error("Somehow we got the wrong type", arguments)
		return []
	}
}