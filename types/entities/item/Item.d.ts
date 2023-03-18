import {ClassEntry, ItemSystem, ItemSystemData, SpellEntry} from "./ItemSystem";

export {}

declare global {
    class Item extends DocumentBase {
        static create(data: any, context: any): Promise<Item5e>
        img: string
        type: string
        system: ItemSystemData

        actor?: Actor5e

        //extensions
        weight(defaultWeight?: number): number
        price(defaultPrice?: number): number
        qty(defaultQty?: number): number
    }

    type Item5e = Item & ItemSystem
    type ItemSpell = Item & SpellEntry
    type ItemClass = Item & ClassEntry
}