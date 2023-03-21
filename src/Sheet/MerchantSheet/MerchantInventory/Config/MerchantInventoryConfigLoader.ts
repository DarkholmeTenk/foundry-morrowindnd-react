import {getArguments} from "../../../../RollTable/Rolling/TableHelper";
import {
    MerchantInventorySource,
    MerchantInventorySourceSimple,
    MerchantInventorySourcePackFilter,
    NestedMerchantInventorySource, ReferencedMerchantInventorySource
} from "./MerchantInventoryConfigData";
import {SellableItemPacks, StoredSellables} from "../Settings";
import LogFactory from "../../../../Util/Logging";
import {isItem, loadItem} from "../../../../Util/Identifiers/UuidHelper";
import {loadPack} from "../../../../Util/Identifiers/PackHelper";

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
    if(source.itemId) {
        let item = await loadItem(source.itemId)
        if(item) {
            return [{
                type: "item5e",
                item,
                qty: source.qty
            }]
        }
    }
    log.warn("Unable to find simple sellable", source)
    return []
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
    let sellable = StoredSellables.value[source.merchantInventoryId]
    if(sellable) {
        return loadSellable(sellable)
    }  else {
        log("No sellable found with id", source.merchantInventoryId)
        return []
    }
}

export async function loadSellable(source: MerchantInventorySource): Promise<MerchantInventoryItem[]> {
    let loaded = await (Loaders[source.type](source as any))
    return loaded.filter(x=>x) as MerchantInventoryItem[]
}
