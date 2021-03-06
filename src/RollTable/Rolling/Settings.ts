import {setupSettingMenu} from "../../Constants/Config";
import PackSelectorComponent, {PackSelectorOptions} from "../../Constants/Packs/PackSelectorComponent";
import {PackId} from "../../Util/Identifiers/PackId";

export const ItemPackSetting = setupSettingMenu<PackId[]>({
    key: "rolltable.itempack",
    name: "Item Packs",
    label: "Item Packs",
    type: PackSelectorComponent,
    default: [{package: "dnd5e", name: "items"}],
    restricted: true,
    sheetOptions: PackSelectorOptions
})


export const SpellPackSetting = setupSettingMenu<PackId[]>({
    key: "rolltable.spellpack",
    name: "Spell Packs",
    label: "Spell Packs",
    type: PackSelectorComponent,
    default: [{package: "dnd5e", name: "spells"}],
    restricted: true,
    sheetOptions: PackSelectorOptions
})