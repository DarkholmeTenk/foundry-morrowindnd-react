export interface Spell extends BaseItemData {
    school: string,
    level: number
}

export interface Consumable extends BaseItemData {
    consumableType: string
}

export interface ClassItem extends BaseItemData {
    subclass: string
}

export interface BaseItemData {
    source: string
    description?: {
        value?: string
    }
}