import {setupSettingMenu} from "../../Constants/Config";
import {PackId} from "../../Util/Identifiers/PackId";
import PackSelectorComponent, {PackSelectorOptions} from "../../Constants/Packs/PackSelectorComponent";

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