import {RollData, RollTableArguments, TableHelper} from "Systems/RollTable/Rolling/TableHelper";
import {getGoldValue} from "Util/Helper/GoldHelper";

type DamagePart = [amount: string, type: string]
interface WeaponEnchantmentData {
	attackBonus?: string,
	damageParts?: DamagePart[],
	prefix?: string,
	suffix?: string,
	valueAdd?: string,
	valueMult?: string
}

export class WeaponEnchantment implements RollData {
	constructor(private readonly data: WeaponEnchantmentData = {}) {
	}

	applyItemModification(weaponData: SmartItemData) {
		if(weaponData.type !== "weapon") return weaponData
		let {attackBonus, damageParts, prefix, suffix, valueAdd, valueMult} = this.data
		let {system} = weaponData
		if(attackBonus && attackBonus != "0") {
			system.attackBonus = system.attackBonus ? system.attackBonus + ` + ${this.data.attackBonus}` : this.data.attackBonus
		}
		if(damageParts) {
			system.damage?.parts.push(...damageParts)
		}
		if(prefix) {
			weaponData.name = prefix + " " + weaponData.name
		}
		if(suffix) {
			weaponData.name += " " + suffix
		}
		let price = getGoldValue(weaponData.system.price)
		if(valueMult) {
			price *= parseFloat(valueMult)
		}
		if(valueAdd) {
			price += parseInt(valueAdd)
		}
		if(valueAdd || valueMult) system.price = {value: price, denomination: "gp"}
		return weaponData
	}

	getItemData(): any[] {
		return [];
	}

	getModifications(actorData: any): { [p: string]: any } {
		return {};
	}

	multiply(num: number): RollData {
		return this
	}
}

export default class TableWeaponEnchantHelper implements TableHelper {
	async getRollData({args}: RollTableArguments): Promise<RollData[]> {
		let attackBonus = args.attackBonus || ""
		let damageParts: DamagePart[] = []
		let damages = args.damage || ""
		let damageTypes = args.damageType || ""
		if(damages != "") {
			let damageSplit = damages.split(",")
			let damageTypeSplit = damageTypes.split(",")
			damageSplit.forEach((damage,index)=>{
				let type = damageTypeSplit[index]
				damageParts.push([damage, type])
			})
		}
		return [new WeaponEnchantment({...args, attackBonus, damageParts})]
	}
}