import {isHoldable} from "Util/Helper/ItemHelper";
import {getMerchantFlag} from "../Flag/MerchantFlag";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import LogFactory from "Util/Logging";
import {
    MerchantInventorySource,
    MerchantInventorySourcePackFilter,
    MerchantInventorySourceSimple,
    NestedMerchantInventorySource,
    ReferencedMerchantInventorySource
} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";
import {isItem, loadItem} from "Util/Identifiers/UuidHelper";
import {getArguments} from "Systems/RollTable/Rolling/TableHelper";
import {loadPack} from "Util/Identifiers/PackHelper";
import {SellableItemPacks, StoredSellables} from "Sheet/MerchantSheet/MerchantInventory/Settings";

const log = LogFactory("SellableLoader")

type LoadResult = Promise<MerchantInventoryItem[]>
type Loader<X extends MerchantInventorySource> = (x: X)=>LoadResult
const Loaders: {[key in MerchantInventorySource['type']]: Loader<MerchantInventorySource & {type: key}>} = {
    "simple": loadSimple,
    "filter": loadFilter,
    "referenced": loadReferenced,
    "nested": loadNested
}

async function loadSimple(source: MerchantInventorySourceSimple): LoadResult {
    let items = await source.itemIds.mapAsync(loadItem)
    return items.filter(x=>x).map(i=>({type: "item5e", item: i as Item5e}))
}

async function loadFilter(source: MerchantInventorySourcePackFilter): LoadResult {
    let filterArguments = getArguments(source.filter)
    let items = await loadPack(source.packOverride || SellableItemPacks.value, isItem)
    return items.filter(x=>filterArguments.filterItem(x)).map(item=>({
        type: "item5e",
        item
    }))

}

async function loadNested(source: NestedMerchantInventorySource): LoadResult {
    return await Promise.all(source.sellables.map(x => loadSellable(x)))
        .then(x => x.flatMap(y => y))
}

async function loadReferenced(source: ReferencedMerchantInventorySource): LoadResult {
    return loadSellableId(source.merchantInventoryId)
}

export async function loadSellable(source: MerchantInventorySource): Promise<MerchantInventoryItem[]> {
    if(!source.type) return []
    let loader = Loaders[source.type]
    if(!loader) return []
    let loaded = await loader(source as any)
    return loaded.filter(x=>x) as MerchantInventoryItem[]
}

export async function loadSellableId(sellableId: string | undefined) {
    if(!sellableId) return []
    let sellable = StoredSellables.value[sellableId]
    if(sellable) {
        return loadSellable(sellable)
    }  else {
        log("No sellable found with id", sellableId)
        return []
    }
}

export function useMerchantActorInventory(merchant: Actor5e): MerchantInventoryItem[] {
    let [merchantFlag] = getMerchantFlag(merchant)
    let {sellables} = merchantFlag
    let result = useSuspensePromise("merchant.sellables", ()=>loadSellableId(sellables), [sellables])
    let items = merchant.items.filter(x=>isHoldable(x._source)).map((item)=>({type: "item5e", item} as MerchantInventoryItem))
    return [...(result ?? []), ...items]
}