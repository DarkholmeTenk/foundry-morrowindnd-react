import {ItemId} from "../../../Util/Identifiers/ItemID";
import {PackId} from "../../../Util/Identifiers/PackId";

export interface SellableItem {
    item: Item<any>,
    qty?: number
}

export interface Sellable {
    qty?: number
}

export interface SimpleSellable extends Sellable {
    itemId: ItemId
}

export interface FilterSellable extends Sellable {
    packOverride?: PackId[]
    filter: string
}

export interface NestedSellable {
    sellables: SellableSource[]
}

export interface ReferencedSellable {
    sellableId: string
}

export type SellableSource = SimpleSellable | FilterSellable | NestedSellable | ReferencedSellable

export function isSimpleSellable(sellable: SellableSource): sellable is SimpleSellable { return (sellable as any).itemId !== undefined }
export function isFilterSellable(sellable: SellableSource): sellable is FilterSellable { return (sellable as any).filter !== undefined }
export function isNestedSellable(sellable: SellableSource): sellable is NestedSellable { return (sellable as any).sellables !== undefined }
export function isReferencedSellable(sellable: SellableSource): sellable is ReferencedSellable { return (sellable as any).sellableId !== undefined }
