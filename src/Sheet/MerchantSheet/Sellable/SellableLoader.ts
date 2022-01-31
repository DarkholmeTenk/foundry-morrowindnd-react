import {getItem} from "../../../Util/Identifiers/ItemID";
import {getArguments} from "../../../RollTable/Rolling/TableHelper";
import {loadPacks} from "../../../Util/Identifiers/PackId";
import {
    isFilterSellable,
    isNestedSellable,
    isReferencedSellable,
    isSimpleSellable,
    SellableItem,
    SellableSource
} from "./SellableData";
import {SellableItemPacks, StoredSellables} from "./Settings";
import LogFactory from "../../../Util/Logging";

const log = LogFactory("SellableLoader")

type NullSell = SellableItem | null
async function loadSellableInternal(source: SellableSource): Promise<NullSell[]> {
    if(isSimpleSellable(source)) {
        let item = await getItem(source.itemId!)
        if(item) {
            return [{item, qty: source.qty}]
        } else {
            log.warn("Unable to find simple sellable", source)
            return []
        }
    } else if(isFilterSellable(source)) {
        let filterArguments = getArguments(source.filter)
        let items = await loadPacks(source.packOverride || SellableItemPacks.value)
        return items.filter(x=>filterArguments.filterItem(x as Item)).map(item=>({item: item as Item}))
    } else if(isNestedSellable(source)) {
        return await Promise.all(source.sellables.map(x => loadSellable(x)))
            .then(x => x.flatMap(y => y))
    } else if(isReferencedSellable(source)) {
        let sellable = StoredSellables.value[source.sellableId]
        if(sellable) {
            return loadSellable(sellable)
        }  else {
            log("No sellable found with id", source.sellableId)
            return []
        }
    } else {
        throw Error("Unknown sellable type")
    }
}

export async function loadSellable(source: SellableSource): Promise<SellableItem[]> {
    let result = await loadSellableInternal(source)
    return result.filter(x=>(x && x.item)) as SellableItem[]
}
