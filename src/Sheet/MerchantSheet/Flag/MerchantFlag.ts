import getFlag, {FlagResult} from "../../../Util/Helper/FlagHelper";
import {itemPrice} from "../../../Util/Extension/Items";

interface MerchantItem {
    itemId: UUID,
    qty?: number
}

export interface MerchantFlag {
    items: MerchantItem[],
    buyRate: number,
    sellRate: number,
    sellables?: string
}

const defaultMerchantFlag: MerchantFlag = {
    items: [],
    buyRate: 3,
    sellRate: 0.2
}

export function getMerchantFlag(actor: Actor): FlagResult<MerchantFlag> {
    return getFlag(actor, "MerchantSheetData", defaultMerchantFlag)
}

export function getBuyPrice(item: Item, qty: number, merchantFlag?: MerchantFlag): number {
    let flag = merchantFlag || defaultMerchantFlag
    return itemPrice(item) * qty * flag.buyRate
}

export function getSellPrice(item: Item, qty: number, merchantFlag?: MerchantFlag): number {
    let flag = merchantFlag || defaultMerchantFlag
    return itemPrice(item) * qty * flag.sellRate
}