import { setupSettingMenu } from "../../Constants/Config";
import PackSelectorComponent, { PackSelectorOptions } from "../../Constants/Packs/PackSelectorComponent";
export const ItemPackSetting = setupSettingMenu({
    key: "rolltable.itempack",
    name: "Item Packs",
    label: "Item Packs",
    type: PackSelectorComponent,
    default: [{ package: "dnd5e", name: "items" }],
    restricted: true,
    sheetOptions: PackSelectorOptions
});
export const SpellPackSetting = setupSettingMenu({
    key: "rolltable.spellpack",
    name: "Spell Packs",
    label: "Spell Packs",
    type: PackSelectorComponent,
    default: [{ package: "dnd5e", name: "spells" }],
    restricted: true,
    sheetOptions: PackSelectorOptions
});
