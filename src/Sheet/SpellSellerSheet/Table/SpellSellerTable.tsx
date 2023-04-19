import {ItemExpander} from "Util/Components/NewItemTable/Item/ItemExpander";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import React from "react";
import {getterColumn} from "Util/Components/NewItemTable/Util/GetterColumn";
import {ImageColumn, NameColumn} from "Util/Components/NewItemTable/Item/ItemColumns";
import {SpellIcon} from "Sheet/SpellSellerSheet/Table/SpellIconColumn";
import {SpellActionsColumn} from "Sheet/SpellSellerSheet/Table/SpellTableActionsColumn";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {getSpellBaseCost} from "Sheet/SpellSellerSheet/SpellCostCalculator";
import {SpellFilter} from "Sheet/SpellSellerSheet/Table/SpellFilter";

const LevelColumn = getterColumn<ItemSpell>("Level", (item)=>item.system.level ?? "-", {cellProps: {width: 32}})
const BasePriceColumn = getterColumn<ItemSpell>("Base Price", (item)=><GoldDisplay value={getSpellBaseCost(item)} />)
const Columns = [
    ImageColumn,
    NameColumn,
    {
        label: "School",
        ColumnComponent: SpellIcon,
        cellProps: {
            width: 32
        }
    },
    LevelColumn,
    BasePriceColumn,
    {
        label: "",
        ColumnComponent: SpellActionsColumn
    }
]

interface Props {
    self: Actor5e,
    merchant: Actor5e,
    spells: ItemSpell[],
    setBuying: (spell: ItemSpell)=>void
}
export function SpellSellerTable({self, merchant, spells, setBuying}: Props) {
    return <NewItemTable filter={SpellFilter} extraData={{self, merchant, setBuying}} expander={ItemExpander} columns={Columns} items={spells} />
}