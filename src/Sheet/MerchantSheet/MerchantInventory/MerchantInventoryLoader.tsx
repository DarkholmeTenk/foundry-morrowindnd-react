import {isHoldable} from "../../../Util/Helper/ItemHelper";
import {usePromise} from "../../../Util/Helper/PromiseHelper";
import {getMerchantFlag} from "../Flag/MerchantFlag";

export async function loadMerchantInventory(merchant: Actor5e): Promise<MerchantInventoryItem[]> {
    let items = merchant.items.filter(x=>isHoldable(x._source)).map((item)=>({type: "item5e", item} as MerchantInventoryItem))
    return items
}

export function useMerchantActorInventory(merchant: Actor5e): {loading: boolean, result: MerchantInventoryItem[]} {
    let [merchantFlag] = getMerchantFlag(merchant)
    let {sellables} = merchantFlag
    let {loading, result} = usePromise(async ()=>{
        return [] as MerchantInventoryItem[]
    }, [sellables])
    if(loading) return {loading, result: []}
    let items = merchant.items.filter(x=>isHoldable(x._source)).map((item)=>({type: "item5e", item} as MerchantInventoryItem))
    return {loading: false, result: [...(result ?? []), ...items]}
}