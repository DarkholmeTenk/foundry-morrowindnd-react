import {ItemExpander} from "Util/Components/NewItemTable/Item/ItemExpander";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import React from "react";
import {getterColumn} from "Util/Components/NewItemTable/Util/GetterColumn";
import {ImageColumn, NameColumn} from "Util/Components/NewItemTable/Item/ItemColumns";
import {SpellIcon} from "Sheet/SpellSellerSheet/Table/SpellIconColumn";
import {SpellActionsColumn} from "Sheet/SpellSellerSheet/Table/SpellTableActionsColumn";
import {StandardItemFilter} from "Util/Components/NewItemTable/Item/Filter/StandardItemFilter";

const LevelColumn = getterColumn<ItemSpell>("Level", (item)=>item.system.level ?? "-", {cellProps: {width: 32}})
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
    {
        label: "",
        ColumnComponent: SpellActionsColumn
    }
]

interface Props {
    self: Actor5e,
    merchant: Actor5e,
    spells: ItemSpell[]
}
export function SpellSellerTable({self, merchant, spells}: Props) {
    return <NewItemTable filter={StandardItemFilter} extraData={{self, merchant}} expander={ItemExpander} columns={Columns} items={spells} />
}