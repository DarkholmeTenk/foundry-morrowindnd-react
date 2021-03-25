import {RollData, RollTableArguments, TableHelper} from "./TableHelper";
import {CurrencyType, getActorDataCurrencyAmount, GoldBreakdown} from "../../Util/Helper/GoldHelper";

type CurrencyLevel = CurrencyType
const CurrencyLevels: CurrencyLevel[] = [CurrencyType.pp, CurrencyType.gp, CurrencyType.sp, CurrencyType.cp]
const defaultLevel = "gp"

type CurrencyValues = GoldBreakdown

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
			let existingValue = getActorDataCurrencyAmount(currency[type]) || 0;
			let modString = `data.currency.${type}`;
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