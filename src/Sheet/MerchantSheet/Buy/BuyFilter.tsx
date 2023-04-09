import {ItemTableFilter} from "Util/Components/NewItemTable/NewItemTableFilters";
import {
    generateFilterFunction,
    ItemFilterState,
    ItemTableFilterComp
} from "Util/Components/NewItemTable/Item/Filter/StandardItemFilter";
import {StateSetter} from "Util/React/update/Updater";

export const MerchantInventoryItemFilter: ItemTableFilter<MerchantInventoryItem, ItemFilterState> = {
    defaultState: {},
    FilterComponent: WrapComponent,
    generateFilter: generateMerchantFilter
}

interface WrapComponentArgs {
    items: MerchantInventoryItem[],
    state: ItemFilterState
    setState: StateSetter<ItemFilterState | undefined>
}
function WrapComponent({items, state, setState}: WrapComponentArgs) {
    let sid = items.map(x=>x.type === "itemdata" ? x.item : x.item._source)
    return <ItemTableFilterComp items={sid} state={state} setState={setState} />
}

type FilterFunction = (item: MerchantInventoryItem) => boolean
function generateMerchantFilter(filter: ItemFilterState): FilterFunction {
    let itemFilter = generateFilterFunction(filter)
    return (item: MerchantInventoryItem) => itemFilter(item.item)
}