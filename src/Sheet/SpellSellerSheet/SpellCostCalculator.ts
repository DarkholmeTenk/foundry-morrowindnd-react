interface Settings {
    BaseCosts: Record<number, number>
    NotClassPenalty: Record<number, number>
    SpecBonus: Record<number, number>
    NoSpecBonus: Record<number, number>
}
const SETTINGS: Settings = {
    BaseCosts: {
        1: 15,
        2: 40,
        3: 140,
        4: 400,
        5: 1000,
        6: 1800,
        7: 4000,
        8: 6000,
        9: 10000
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
        6: 0.75,
        7: 0.75,
        8: 0.75,
        9: 0.75
    },
    NoSpecBonus: {
        1: 0.6,
        2: 0.75,
        3: 0.8,
        4: 0.85,
        5: 0.85,
        6: 0.85,
        7: 0.85,
        8: 0.85,
        9: 0.85
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