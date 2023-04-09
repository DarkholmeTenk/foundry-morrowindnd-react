import PackSelectorComponent, {PackSelectorOptions} from "../../../Constants/Packs/PackSelectorComponent";
import {MerchantInventorySource} from "./Config/MerchantInventoryConfigData";
import StoredSellableComponent, {StoredSellableComponentOptions} from "./StoredSellableComponent";
import {setupSettingMenu} from "Settings/SettingMenu";

export const SellableItemPacks = setupSettingMenu<UUID[]>({
    key: "sellable.itempack",
    name: "Sellable - Item Packs",
    label: "Sellable - Item Packs",
    type: PackSelectorComponent,
    default: ["dnd5e.items"],
    restricted: true,
    sheetOptions: PackSelectorOptions,
    scope: "world"
})

export interface SellableSourceExtra {
    icon?: string
    name?: string
}
type IdentifiableSellable = MerchantInventorySource & SellableSourceExtra

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