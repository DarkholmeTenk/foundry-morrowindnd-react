export interface ItemType {
    icon: string,
    name: string,
}

export const ItemTypes: Record<string, ItemType> = {
    weapon: {
        icon: 'fas fa-hand-rock',
        name: "Weapons"
    },
    equipment: {
        icon: 'fas fa-shield-alt',
        name: "Equipment"
    },
    consumable: {
        icon: 'fas fa-prescription-bottle-alt',
        name: "Consumables"
    },
    tool: {
        icon: 'fas fa-tools',
        name: "Tools"
    },
    loot: {
        icon: 'fas fa-gem',
        name: "Loot"
    },
    class: {
        icon: 'fas fa-skull',
        name: "Class"
    },
    spell: {
        icon: 'fas fa-magic',
        name: "Spells"
    },
    feat: {
        icon: 'fas fa-skull',
        name: "Feats"
    },
    backpack: {
        icon: 'fas fa-suitcase',
        name: "Backpack"
    },
}

export const SpellSchools: Record<string, ItemType> = {
    con: {
        icon: 'fas fa-ghost',
        name: 'Conjuration'
    },
    trs: {
        icon: 'fas fa-sync',
        name: 'Transmutation'
    },
    nec: {
        icon: 'fas fa-skull',
        name: 'Necromancy'
    },
    ill: {
        icon: 'fas fa-hand-sparkles',
        name: 'Illusion'
    },
    evo: {
        icon: 'fas fa-magic',
        name: 'Evocation'
    },
    div: {
        icon: 'fas fa-search',
        name: 'Divination'
    },
    abj: {
        icon: 'fas fa-shield-alt',
        name: 'Abjuration'
    },
    enc: {
        icon: 'fas fa-hat-wizard',
        name: 'Enchanting'
    }
}