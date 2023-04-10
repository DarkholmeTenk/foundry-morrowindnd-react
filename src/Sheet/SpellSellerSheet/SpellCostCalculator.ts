interface Settings {
    BaseCosts: Record<number, number>
    NotClassPenalty: Record<number, number>
    SpecBonus: Record<number, number>
    NoSpecBonus: Record<number, number>
}
const SETTINGS: Settings = {
    BaseCosts: {
        1: 30,
        2: 80,
        3: 300,
        4: 1000,
        5: 2000,
        6: 3000,
        7: 5000,
        8: 7500,
        9: 12000
    },
    NotClassPenalty: {
        1: 2,
        2: 2.25,
        3: 2.5,
        4: 2.75,
        5: 3,
        6: 3,
        7: 3,
        8: 3,
        9: 3
    },
    SpecBonus: {
        1: 0.5,
        2: 0.6,
        3: 0.65,
        4: 0.7,
        5: 0.75,
        6: 0.8,
        7: 0.85,
        8: 0.9,
        9: 0.9
    },
    NoSpecBonus: {
        1: 0.75,
        2: 0.8,
        3: 0.825,
        4: 0.85,
        5: 0.875,
        6: 0.9,
        7: 0.925,
        8: 0.95,
        9: 0.95
    }
}

export function getSpellBaseCost(item: ItemSpell): number {
    let level = item.system.level
    if(level < 1 || level > 9) return NaN
    return SETTINGS.BaseCosts[level]
}

function getPrices(modifier: SpellPurchasePriceModifier) {
    switch(modifier) {
        case SpellPurchasePriceModifier.NONE: return {}
        case SpellPurchasePriceModifier.SPEC: return SETTINGS.SpecBonus
        case SpellPurchasePriceModifier.CROSS_CLASS: return SETTINGS.NotClassPenalty
        case SpellPurchasePriceModifier.NO_SPEC: return SETTINGS.NoSpecBonus
    }
}

export function calculateSpellCost(spell: ItemSpell, modifier: SpellPurchasePriceModifier): number | null {
    let level = spell.system.level
    if(level < 1 || level > 9) return null
    let x: Record<number, number> = getPrices(modifier)
    let mod = x[level] ?? 1
    return SETTINGS.BaseCosts[level] * mod
}

export enum SpellPurchasePriceModifier {
    NONE = "none",
    SPEC = "spec",
    CROSS_CLASS = "cross_class",
    NO_SPEC = "no_spec"
}