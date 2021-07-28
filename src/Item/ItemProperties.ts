import getFlag from "../Util/Helper/FlagHelper"

export interface ItemProperties {
    soulGem?: {
        isSoulGem: boolean,
        size: string,
        fillSize: string
    }
    alchemy?: {
        effects: {
            id: string,
            bonus?: number
        }[]
    }
}

export const ITEM_FLAG = "extra_properties"

export function getProperties(item: Item<any>): [ItemProperties, (newProperties: ItemProperties)=>Promise<any>] {
    return getFlag<ItemProperties>(item, ITEM_FLAG, {})
}