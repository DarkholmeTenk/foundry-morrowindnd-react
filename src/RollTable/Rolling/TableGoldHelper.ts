import {RollData, RollTableArguments, TableHelper} from "./TableHelper";

enum CurrencyLevel {
	"pp"= "pp",
	"gp"= "sp",
	"sp"= "sp",
	"cp"= "cp"
}
const CurrencyLevels: CurrencyLevel[] = [CurrencyLevel.pp, CurrencyLevel.gp, CurrencyLevel.sp, CurrencyLevel.cp]
const defaultLevel = "gp"

type CurrencyValues = {[level in CurrencyLevel]?: number}

export class CurrencyItem implements RollData {
	constructor(private readonly values: CurrencyValues) {
	}

	map(fun) {
		let resultObj: CurrencyValues = {}
		CurrencyLevels.forEach(level=>{
			let existing = this.values[level] || 0
			let result = fun(existing, level)
			resultObj[level] = result
		})
		return resultObj
	} 

	multiply(amount) {
		return new CurrencyItem(this.map(v=>v * amount))
	}

	add(other) {
		let ov = other.values
		return new CurrencyItem(this.map((v,i)=> v + ov[i]))
	}

	isEmpty() {
		return !CurrencyLevels.some(level=>{
			return this.values[level]
		})
	}

	getModifications(actorData) {
		let modifications = {}
		let currency = actorData?.data?.currency || {}
		this.map((value, type)=>{
			if(!value) return;
			let existingValue = (currency[type]?.value || 0);
			let modString = `data.currency.${type}.value`;
			modifications[modString] = existingValue + value
		})
		return modifications
	}

	getItemData(): any[] {
		return []
	}

	applyItemModification(itemData: any) { return itemData }

	toString() {
		return `CurrencyItem ${JSON.stringify(this.values)}`
	}
}

export default class TableGoldHelper implements TableHelper {
	async getRollData({args}: RollTableArguments): Promise<RollData[]> {
		let values = {}
		if(args.roll) {
			values[defaultLevel] = args.roll
		}
		CurrencyLevels.forEach(level=>{
			if(args[level]) {
				values[level] = args[level]
			}
		})
		for(let key in values) {
			let roll = values[key]
			let result = parseInt(new Roll(roll).roll().total as any as string)
			values[key] = result
		}
		return [new CurrencyItem(values)]
	}

}