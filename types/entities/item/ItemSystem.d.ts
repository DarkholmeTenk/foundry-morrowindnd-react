import {SystemEntry} from "../../DocumentBase";

export {}
declare global {
    interface BaseItemData extends ItemUsageData, ItemActivationData {
        source?: string
        description?: {
            value?: string
        }
    }

    interface HoldableItemData extends BaseItemData {
        quantity?: number
        weight?: number
        price?: { value: number, denomination: CurrencyDenomination }
        rarity?: string
    }

    interface ConsumableData extends HoldableItemData {
        consumableType?: string
    }

    type ConsumableEntry = SystemEntry<"consumable", ConsumableData>

    interface EquipmentData extends HoldableItemData {
    }

    type EquipmentEntry = SystemEntry<"equipment", EquipmentData>

    interface ClassData extends BaseItemData {
        subclass: string
    }

    type ClassEntry = SystemEntry<"class", ClassData>

    interface SpellData extends BaseItemData {
        school: string
        level: number
    }

    type SpellEntry = SystemEntry<"spell", SpellData>

    type UndecoratedEntry = SystemEntry<"backpack" | "feat" | "subclass", BaseItemData>
    type HoldableUndecoratedEntry = SystemEntry<"loot" | "tool" | "weapon", HoldableItemData>

    type HoldableEntry = HoldableUndecoratedEntry | EquipmentEntry | ConsumableEntry

    export type ItemSystem =
        SpellEntry
        | EquipmentEntry
        | ClassEntry
        | ConsumableEntry
        | UndecoratedEntry
        | HoldableUndecoratedEntry
    export type ItemSystemData = ItemSystem["system"]
}
