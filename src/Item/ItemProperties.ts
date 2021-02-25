// @ts-ignore
import {getFlag} from "../Util/FlagHelper"

export interface ItemProperties {
    soulGem?: {
        isSoulGem: boolean,
        size: string,
        fillSize: string
    }
}

export const ITEM_FLAG = "extra_properties"

export function getProperties(item): [ItemProperties, (newProperties: ItemProperties)=>Promise<any>] {
    return getFlag(item, ITEM_FLAG, {})
}