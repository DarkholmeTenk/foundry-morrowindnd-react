import PackSelectorComponent, {PackSelectorOptions} from "../../Constants/Packs/PackSelectorComponent";
import {PackId} from "../../Util/Identifiers/PackHelper";
import {setupSettingMenu} from "../../Settings/SettingMenu";

export const ItemPackSetting = setupSettingMenu<PackId[]>({
    key: "rolltable.itempack",
    name: "Item Packs",
    label: "Item Packs",
    type: PackSelectorComponent,
    default: ["dnd5e.items"],
    restricted: true,
    sheetOptions: PackSelectorOptions,
    scope: "world"
})


export const SpellPackSetting = setupSettingMenu<PackId[]>({
    key: "rolltable.spellpack",
    name: "Spell Packs",
    label: "Spell Packs",
    type: PackSelectorComponent,
    default: ["dnd5e.items"],
    restricted: true,
    sheetOptions: PackSelectorOptions,
    scope: "world"
})