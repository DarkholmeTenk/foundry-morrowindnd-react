import {isHoldable} from "Util/Helper/ItemHelper";
import {getMerchantFlag} from "../Flag/MerchantFlag";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";

export async function loadMerchantInventory(merchant: Actor5e): Promise<MerchantInventoryItem[]> {
    await new Promise(r=>setTimeout(r, 3000))
    return []
}

export function useMerchantActorInventory(merchant: Actor5e): MerchantInventoryItem[] {
    let [merchantFlag] = getMerchantFlag(merchant)
    let {sellables} = merchantFlag
    let result = useSuspensePromise("merchant.sellables", ()=>loadMerchantInventory(merchant), [sellables])
    let items = merchant.items.filter(x=>isHoldable(x._source)).map((item)=>({type: "item5e", item} as MerchantInventoryItem))
    return [...(result ?? []), ...items]
}