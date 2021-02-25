import {RollData, RollTableArguments, TableHelper} from "./TableHelper";

interface WeaponEnchantmentData {
	attackBonus?: string,
	damageParts?: [amount: string, type: string][],
	prefix?: string,
	suffix?: string,
	valueAdd?: string,
	valueMult?: string
}

export class WeaponEnchantment implements RollData {
	constructor(private readonly data: WeaponEnchantmentData = {}) {
	}

	applyItemModification(weaponData: any) {
		if(weaponData.type !== "weapon") return
		let {attackBonus, damageParts, prefix, suffix, valueAdd, valueMult} = this.data
		if(attackBonus && attackBonus != "0") {
			weaponData.data.attackBonus += ` + ${this.data.attackBonus}`
		}
		if(damageParts) {
			weaponData.data.damage.parts.push(...damageParts)
		}
		if(prefix) {
			weaponData.name = prefix + " " + weaponData.name
		}
		if(suffix) {
			weaponData.name += " " + suffix
		}
		if(valueMult) {
			weaponData.data.price = Math.round(weaponData.data.price * parseFloat(valueMult))
		}
		if(valueAdd) {
			weaponData.data.price += parseInt(valueAdd)
		}
	}

	getItemData(): any[] {
		return [];
	}

	getModifications(actorData: any): { [p: string]: any } {
		return {};
	}
}

export default class TableWeaponEnchantHelper implements TableHelper {
	async getRollData({args}: RollTableArguments): Promise<RollData[]> {
		let attackBonus = args.attackBonus || ""
		let damageParts = []
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