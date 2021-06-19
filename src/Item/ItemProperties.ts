import getFlag from "../Util/Helper/FlagHelper"

export interface ItemProperties {
    soulGem?: {
        isSoulGem: boolean,
        size: string,
        fillSize: string
    }
}

export const ITEM_FLAG = "extra_properties"

export function getProperties(item): [ItemProperties, (newProperties: ItemProperties)=>Promise<any>] {
    return getFlag<ItemProperties>(item, ITEM_FLAG, {})
}