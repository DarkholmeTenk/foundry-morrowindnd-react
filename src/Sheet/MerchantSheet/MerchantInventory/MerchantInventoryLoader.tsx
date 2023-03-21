import {isHoldable} from "../../../Util/Helper/ItemHelper";

export async function loadMerchantInventory(merchant: Actor5e): Promise<MerchantInventoryItem[]> {
    let items = merchant.items.filter(x=>isHoldable(x._source)).map((item)=>({type: "item5e", item} as MerchantInventoryItem))
    return items
}