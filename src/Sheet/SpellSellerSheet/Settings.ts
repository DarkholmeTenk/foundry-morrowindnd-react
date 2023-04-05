import PackSelectorComponent, {PackSelectorOptions} from "../../Constants/Packs/PackSelectorComponent";
import {setupSettingMenu} from "@/Settings/SettingMenu";

export const SpellSellerPacks = setupSettingMenu<UUID[]>({
    key: "spellseller.itempack",
    name: "Spell Seller - Spell Packs",
    label: "Spell Seller - Spell Packs",
    type: PackSelectorComponent,
    default: ["dnd5e.spells"],
    restricted: true,
    sheetOptions: PackSelectorOptions,
    scope: "world"
})