import {itemPrice} from "../../Util/Extension/Items";

interface MerchantItem {
    itemId: UUID,
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
    let flag: SpellSellertFlag = {...defaultMerchantFlag, ...(actor.getFlag("morrowindnd", "MerchantSheetData") as any || {})}
    return [flag, (newFlag)=>actor.setFlag("morrowindnd", "MerchantSheetData", newFlag)]
}

export function getBuyPrice(item: Item, qty: number, merchantFlag?: SpellSellertFlag): number {
    let flag = merchantFlag || defaultMerchantFlag
    return itemPrice(item) * qty * flag.buyRate
}

export function getSellPrice(item: Item, qty: number, merchantFlag?: SpellSellertFlag): number {
    let flag = merchantFlag || defaultMerchantFlag
    return itemPrice(item) * qty * flag.sellRate
}