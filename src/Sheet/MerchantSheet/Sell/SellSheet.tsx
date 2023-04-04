import React, {Fragment, useState} from "react";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {getBuyPrice, getSellPrice, MerchantFlag} from "../Flag/MerchantFlag";
import {openItemQuantitySelect} from "../../LootSheet/ItemQuantitySelector";
import {Button, Paper} from "@material-ui/core";
import Styles from "./SellSheet.module.scss"
import {onDrop} from "../../../Util/Helper/DropHelper";
import SellDesireButton from "../../LootSheet/Desire/SellDesireButton";
import {MerchantSell} from "./SellAction";
import {DefaultItemColumns, ImageColumn, NameColumn} from "../../../Util/Components/NewItemTable/Item/ItemColumns";
import {getGoldAmountFromActor} from "../../../Util/Helper/GoldHelper";
import {ItemControl} from "../../../Util/Components/NewItemTable/Item/ItemControls";
import {NewItemTable} from "../../../Util/Components/NewItemTable/NewItemTable";
import {isHoldable} from "../../../Util/Helper/ItemHelper";
import {useArrayAdder, useArrayReducers, useArrayRemover} from "../../../Util/Helper/ArrayReducers";
import {mappedColumn} from "../../../Util/Components/NewItemTable/Util/MapColumns";
import {StateSetter} from "../../../Util/React/update/Updater";
import {DropBox} from "./DropBox";
import {getterColumn} from "../../../Util/Components/NewItemTable/Util/GetterColumn";
import {ItemExpander} from "../../../Util/Components/NewItemTable/Item/ItemExpander";
import {AddCargoButton, SellCompleteAction} from "./SellCompleteAction";
import {getPartyCargoHolder, isPartyCargoHolder, TokenSettings} from "../../../Token/TokenSettings";
import {act} from "react-dom/test-utils";

export interface SellItem {
    item: Item5e,
    qty: number
}

function mapSI(i: SellItem) { return i.item }

const NewColumns = [
    ...mappedColumn(mapSI, [ImageColumn, NameColumn]),
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
    merchantFlag: MerchantFlag
}
export default function SellSheet({self, merchant, merchantFlag}: Props) {
    let [items, setItems] = useState<SellItem[]>([])
    let adder = useArrayAdder(setItems)
    let cargo = getPartyCargoHolder()
    let drop = onDrop((i)=>{
        if(i instanceof Item) {
            let item = i as Item5e
            let actor = item.actor
            if(!actor) return
            if(actor.uuid !== self.uuid && !isPartyCargoHolder(actor)) return
            if(items.some(x=>x.item.uuid === item.uuid)) return
            let maxQty = item.qty(1)
            if(maxQty === 1)
                adder({item, qty: 1})
            else
                openItemQuantitySelect({item, max: item.qty(), text: "How many to sell", onConfirm: (qty)=>adder({item, qty}), buttonText: "Sell"})
        }
    })
    return <div onDrop={drop}>
        <div className={Styles.OpenActorBar}>
            {cargo ? <button onClick={()=>cargo?.sheet?.render(true)}>Open {cargo.name}</button> : null }
            <button onClick={()=>self.sheet?.render(true)}>Open {self.name}</button>
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