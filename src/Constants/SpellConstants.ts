import {isItem} from "Util/Identifiers/UuidHelper";

export function isSpell(value: any): value is ItemSpell {
	return isItem(value) && value.type === "spell"
}

export const SpellLevelValues: {[level: number]:{value: number, weight: number}} = {
	0: { value: 50, weight: 20 },
	1: { value: 75, weight: 16 },
	2: { value: 125, weight: 14 },
	3: { value: 700, weight: 10 },
	4: { value: 1200, weight: 8 },
	5: { value: 4000, weight: 6 },
	6: { value: 7000, weight: 4 },
	7: { value: 10000, weight: 3 },
	8: { value: 14000, weight: 2 },
	9: { value: 24000, weight: 1 },
};

export function calculateEnchantValueAdd(spellLevel: number, charges: number): number {
	return SpellLevelValues[spellLevel].value * charges
}