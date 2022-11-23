import {SystemEntry} from "../../DocumentBase";

export interface BaseItemData {
    source?: string
    description?: {
        value?: string
    }
}

export interface HoldableItemData extends BaseItemData {
    quantity?: number
    weight?: number
    price?: number
}

export interface ConsumableData extends HoldableItemData {
    consumableType?: string
}
export type ConsumableEntry = SystemEntry<"consumable", ConsumableData>

export interface EquipmentData extends HoldableItemData { }
export type EquipmentEntry = SystemEntry<"equipment", EquipmentData>

export interface ClassData extends BaseItemData {
    subclass: string
}
export type ClassEntry = SystemEntry<"class", ClassData>

export interface SpellData extends BaseItemData {
    school: string
    level: number
}
export type SpellEntry = SystemEntry<"spell", SpellData>

export type ItemSystem = SpellEntry | EquipmentEntry | ClassEntry | ConsumableEntry
export type ItemSystemData = ItemSystem["system"]
