export default class EnchantConfig {
	static instance = new EnchantConfig()
	
	get CastableSizes(): EnchantCastableSize[] {
		return [
			new EnchantCastableSize({charges: 2, label: "Minor", weight: 8, difficultyMod: 1}),
			new EnchantCastableSize({charges: 5, label: "Major", weight: 3, difficultyMod: 2}),
			new EnchantCastableSize({charges: 10, label: "Superior", weight: 1, difficultyMod: 3}),
			new EnchantCastableSize({charges: 15, label: "Immense", weight: 0.5, difficultyMod: 5})
		]
	}

	getRandomCharge(): EnchantCastableSize {
		let chargeTypes = this.CastableSizes
		let max = chargeTypes.map(x=>x.weight).reduce((p,c)=>p+c)
		let newRand = Math.random() * max
		for(let i in chargeTypes) {
			let c = chargeTypes[i]
			if(newRand <= c.weight) return c
			newRand -= c.weight
		}
		return chargeTypes[0];
	}

	get CastableSpellLevels(): EnchantCastableSpellLevel[] {
		return [
			new EnchantCastableSpellLevel({ level: 0, value: 50, weight: 20, difficultyMod: 1 }),
			new EnchantCastableSpellLevel({ level: 1, value: 75, weight: 16, difficultyMod: 2 }),
			new EnchantCastableSpellLevel({ level: 2, value: 125, weight: 14, difficultyMod: 4 }),
			new EnchantCastableSpellLevel({ level: 3, value: 700, weight: 10, difficultyMod: 6 }),
			new EnchantCastableSpellLevel({ level: 4, value: 1200, weight: 8, difficultyMod: 8 }),
			new EnchantCastableSpellLevel({ level: 5, value: 4000, weight: 6, difficultyMod: 10 }),
			new EnchantCastableSpellLevel({ level: 6, value: 7000, weight: 4, difficultyMod: 12 }),
			new EnchantCastableSpellLevel({ level: 7, value: 10000, weight: 3, difficultyMod: 15 }),
			new EnchantCastableSpellLevel({ level: 8, value: 14000, weight: 2, difficultyMod: 18 }),
			new EnchantCastableSpellLevel({ level: 9, value: 24000, weight: 1, difficultyMod: 22 }),
		]
	}

	forSpellLevel(level): EnchantCastableSpellLevel {
		return this.CastableSpellLevels.find(l=>l.level === level)
	}

	get WeaponDamageUpgrades() {
		return [
			{level: 1, difficultyMod: 2,  soulSize: 5,   label: "+1"},
			{level: 2, difficultyMod: 5,  soulSize: 15,  label: "+2"},
			{level: 3, difficultyMod: 8,  soulSize: 35,  label: "+3"},
			{level: 4, difficultyMod: 11, soulSize: 65,  label: "+4"},
			{level: 5, difficultyMod: 15, soulSize: 110, label: "+5"}
		]
	}

	get WeaponAttackUpgrades() {
		return [
			{level: 1, difficultyMod: 5,  soulSize: 10,  label: "+1"},
			{level: 2, difficultyMod: 8,  soulSize: 35,  label: "+2"},
			{level: 3, difficultyMod: 11, soulSize: 85,  label: "+3"},
			{level: 4, difficultyMod: 15, soulSize: 165, label: "+4"},
		]
	}

	get ArmorUpgrades() {
		return [
			{level: 1, difficultyMod:  6,  soulSize:  35},
			{level: 1, difficultyMod:  8,  soulSize:  50},
			{level: 1, difficultyMod:  12, soulSize:  80},
			{level: 1, difficultyMod:  16, soulSize:  160},
		]
	}

	get SoulSizes() {
		return [
			new SoulSize({label: "Petty",   size: 5}),
			new SoulSize({label: "Lesser",  size: 20}),
			new SoulSize({label: "Common",  size: 50}),
			new SoulSize({label: "Greater", size: 100}),
			new SoulSize({label: "Grand",   size: 200}),
		]
	}

	static get SoulSizes() {
		return EnchantConfig.instance.SoulSizes
	}
}

export class EnchantCastableSize {
	public charges: number
	public label: string
	public weight: number
	public difficultyMod: number

	constructor(data: Partial<EnchantCastableSize>) {
		Object.assign(this, data)
	}
}

export class EnchantCastableSpellLevel  {
	public level: number
	public value: number
	public weight: number
	public difficultyMod: number
	constructor(data: Partial<EnchantCastableSpellLevel>) {
		Object.assign(this, data)
	}
}


export class SoulSize {
	public label: string
	public size: number
	constructor(data: Partial<SoulSize>) {
		Object.assign(this, data)
	}
}