export {}

declare global {
    interface ItemData extends DocumentBaseData {
        _id?: string
        img: string
        type: string
        system: ItemSystemData
        name: string
        folder?: string
    }
    type SmartItemData = ItemData & ItemSystem

    class Item extends DocumentBase implements ItemData {
        static create(data: ItemData, context: any): Promise<Item5e>
        img: string
        type: string
        system: ItemSystemData

        actor?: Actor5e
        _source: SmartItemData

        //extensions
        weight(defaultWeight?: number): number
        price(defaultPrice?: number): number
        qty(defaultQty?: number): number
    }

    type Item5e = Item & ItemSystem
    type ItemSpell = Item5e & SpellEntry
    type ItemClass = Item5e & ClassEntry

    class Items extends WorldCollection<Item5e> {
        static registerSheet(scope: String, sheet: typeof DocumentSheet<Item5e>, options: any)
    }
}