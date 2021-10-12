import {setupSettingMenu} from "../../../Constants/Config";
import {PackId} from "../../../Util/Identifiers/PackId";
import PackSelectorComponent, {PackSelectorOptions} from "../../../Constants/Packs/PackSelectorComponent";
import {SellableSource} from "./SellableData";
import StoredSellableComponent, {StoredSellableComponentOptions} from "./StoredSellableComponent";

export const SellableItemPacks = setupSettingMenu<PackId[]>({
    key: "sellable.itempack",
    name: "Sellable - Item Packs",
    label: "Sellable - Item Packs",
    type: PackSelectorComponent,
    default: [{package: "dnd5e", name: "items"}],
    restricted: true,
    sheetOptions: PackSelectorOptions,
    scope: "world"
})

export interface SellableSourceExtra {
    icon?: string
    name?: string
}
type IdentifiableSellable = SellableSource & SellableSourceExtra

type StoredSellable = Record<string, IdentifiableSellable>

export const StoredSellables = setupSettingMenu<StoredSellable>({
    key: "sellable.stored",
    name: "Sellable - Sellables",
    label: "Sellable - Sellables",
    type: StoredSellableComponent,
    default: {},
    restricted: true,
    sheetOptions: StoredSellableComponentOptions,
    scope: "world"
})

export function getIdentifiableSellable(id: string): IdentifiableSellable | undefined {
    return StoredSellables.value[id]
}