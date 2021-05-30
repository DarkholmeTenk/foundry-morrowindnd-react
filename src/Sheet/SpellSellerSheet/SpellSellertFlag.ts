import {ItemId} from "../../Util/Identifiers/ItemID";

interface MerchantItem {
    itemId: ItemId,
    qty?: number
}

export interface SpellSellertFlag {
    items: MerchantItem[],
    buyRate: number,
    sellRate: number,
    sellables?: string
}

const defaultMerchantFlag: SpellSellertFlag = {
    items: [],
    buyRate: 3,
    sellRate: 0.2
}

export function getMerchantFlag(actor: Actor): [SpellSellertFlag, (MerchantFlag)=>Promise<any>] {
    let flag: SpellSellertFlag = {...defaultMerchantFlag, ...(actor.getFlag("morrowindnd", "MerchantSheetData") || {})}
    return [flag, (newFlag)=>actor.setFlag("morrowindnd", "MerchantSheetData", newFlag)]
}

export function getBuyPrice(item: Item, qty: number, merchantFlag?: SpellSellertFlag): number {
    let flag = merchantFlag || defaultMerchantFlag
    let itemPrice = (item.data.data as any).price
    return itemPrice * qty * flag.buyRate
}

export function getSellPrice(item: Item, qty: number, merchantFlag?: SpellSellertFlag): number {
    let flag = merchantFlag || defaultMerchantFlag
    let itemPrice = (item.data.data as any).price
    return itemPrice * qty * flag.sellRate
}