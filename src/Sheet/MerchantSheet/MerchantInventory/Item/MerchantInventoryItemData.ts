import {getGoldValue} from "Util/Helper/GoldHelper";

export function miiSrc({type, item}: MerchantInventoryItem): SmartItemData {
    return (type === "item5e") ? item._source : item
}

function withSrc<T>(item: MerchantInventoryItem, c: (src: SmartItemData)=>T): T {
    return c(miiSrc(item))
}

export function miiPrice(mii: MerchantInventoryItem) {
    return withSrc(mii, ({system})=>("price" in system ? getGoldValue(system.price) : 0))
}

export function miiQty(mii: MerchantInventoryItem): number {
    return mii.qty ?? withSrc(mii, ({system})=>("quantity" in system ? system.quantity : 100) ?? 100)
}