import React, {useState} from "react";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {getSellPrice, MerchantFlag} from "../Flag/MerchantFlag";
import {openItemQuantitySelect} from "../../LootSheet/ItemQuantitySelector";
import Styles from "./SellSheet.module.scss"
import {onDrop} from "Util/Helper/DropHelper";
import {ImageColumn, NameColumn} from "Util/Components/NewItemTable/Item/ItemColumns";
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import {useArrayAdder, useArrayRemover} from "Util/Helper/ArrayReducers";
import {mappedColumns} from "Util/Components/NewItemTable/Util/MapColumns";
import {StateSetter} from "Util/React/update/Updater";
import {DropBox} from "./DropBox";
import {getterColumn} from "Util/Components/NewItemTable/Util/GetterColumn";
import {ItemExpander} from "Util/Components/NewItemTable/Item/ItemExpander";
import {AddCargoButton, SellCompleteAction} from "./SellCompleteAction";
import {getPartyCargoHolder, isPartyCargoHolder} from "Settings/token/TokenSettings";
import {Button} from "Util/Components/SimpleComponents";
import {State} from "pixi.js";

export interface SellItem {
    item: Item5e,
    qty: number
}

function mapSI(i: SellItem) { return i.item }

const NewColumns = [
    ...mappedColumns(mapSI, [ImageColumn, NameColumn]),
    getterColumn<SellItem>("Qty", ({qty})=><>{qty}</>, {cellProps: {width: 120}}),
    {label: "Price", ColumnComponent: ({item, merchantFlag})=><GoldDisplay value={getSellPrice(item.item, item.qty, merchantFlag)}/>},
    {label: "", ColumnComponent: SellControls, cellProps: {width: 120}}
]

interface BuyControlsArgs {
    self: Actor5e
    merchant: Actor5e
    merchantFlag: MerchantFlag
    item: SellItem
    index: number
    setItems: StateSetter<SellItem[]>
}
function SellControls({merchant, self, item, index, merchantFlag, setItems}: BuyControlsArgs) {
    if(!self) return null
    let remover = useArrayRemover(setItems)
    return <>
        <ItemControl title="Delete" icon="fas fa-trash" onClick={()=>remover(index)} />
    </>
}

interface Props {
    self: Actor5e
    merchant: Actor5e
    merchantFlag: MerchantFlag,
    items: SellItem[],
    setItems: StateSetter<SellItem[]>
}
export default function SellSheet({self, merchant, merchantFlag, items, setItems}: Props) {
    let cargo = getPartyCargoHolder()
    return <div>
        <div className={Styles.OpenActorBar}>
            {cargo ? <Button onClick={()=>cargo?.sheet?.render(true)}>Open {cargo.name}</Button> : null }
            <Button onClick={()=>self.sheet?.render(true)}>Open {self.name}</Button>
        </div>
        {items.length == 0 && <div><DropBox /><AddCargoButton items={items} setItems={setItems} self={self} /></div>}
        {items.length > 0 && <NewItemTable
            extraData={{self, merchant, merchantFlag, setItems}}
            columns={NewColumns}
            items={items}
            expander={({item})=><ItemExpander item={item.item}/>}
            actions={SellCompleteAction}
        />}
    </div>
}