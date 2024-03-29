import {RollData, RollTableArguments, TableHelper} from "Systems/RollTable/Rolling/TableHelper";
import doRollTable from "Systems/RollTable/Rolling/TableRoller";
import {callRoll} from "Util/Helper/RollHelper";

async function nAsync(number, generator) {
	let array = Array(number).fill(" ")
	return await Promise.all(array.map(async ()=>await generator()))
}

export default class TableTableHelper implements TableHelper {
	async getRollData({args, filterItem}: RollTableArguments): Promise<RollData[]> {
		if(!args.table) {
			throw Error("No @table argument specified")
		} else {
			let table = game.tables!.find(t=>t.name === args.table)
			if(!table) {
				throw Error(`No table found for name [${args.table}]`)
			} else {
				let min = parseInt(args.min || "0")
				let results: any[] = []
				if(min) {
					let i = 0
					while(results.length < min && i < 20) {
						let items = (await doRollTable(table.id!)).flatMap(i=>i.getItemData()).filter(filterItem)
						if(items.length > 0) {
							results.push(...items)
						}
						i++
					}
				} else {
					let rollString = args.roll || "1"
					let rollResult = await callRoll(rollString)
					let resultTables = await nAsync(rollResult, ()=>doRollTable(table!.id!))
					results = resultTables
						.flatMap(i=>i)
						.flatMap(i=>i)
						.filter(filterItem)
				}
				let max = parseInt(args.max || "100")
				return results.slice(0, max)
			}
		}
	}
}
