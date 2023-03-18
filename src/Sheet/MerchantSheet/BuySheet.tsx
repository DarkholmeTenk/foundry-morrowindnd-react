import {getBuyPrice, getMerchantFlag, MerchantFlag} from "./MerchantFlag";
import {MerchantBuy} from "./MerchantAction";
import {openItemQuantitySelect} from "../LootSheet/ItemQuantitySelector";
import React, {Fragment} from "react";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import {Paper} from "@material-ui/core";
import {SellableItem} from "./Sellable/SellableData";
// @ts-ignore
import Styles from "./MerchantSheet.module.scss"
import {SellableStuff} from "./MerchantSheetComponent";
import {itemQty} from "../../Util/Extension/Items";
import {ItemControl} from "../../Util/Components/NewItemTable/Item/ItemControls";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import {DefaultItemColumns} from "../../Util/Components/NewItemTable/Item/ItemColumns";
import {TableColumn} from "../../Util/Components/NewItemTable/TableColumn";
import {NewItemTable} from "../../Util/Components/NewItemTable/NewItemTable";

function getGetQty(sellables: SellableItem[]): ((Item)=>number | undefined) {
    return (item: Item)=>{
        let found = sellables.find(x=>x.item === item)
        if(found && found.qty) {
            return found.qty
        } else {
            return itemQty(item)
        }
    }
}

function doBuy(self: Actor5e, merchant: Actor5e, item: Item5e) {
    let [merchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = getGoldAmountFromActor(self)
    let itemPrice = getBuyPrice(item, 1, merchantFlag)
    let buy = (qty) => MerchantBuy({
        self: self.uuid,
        merchant: merchant.uuid,
        item: item.uuid,
        qty
    })
    openItemQuantitySelect({
        item,
        max: Math.min(item.qty(10), Math.floor(myGoldAmount / itemPrice)),
        buttonText: (qty) => <Fragment>
            Buy
            <GoldDisplay value={getBuyPrice(item, qty, merchantFlag)}/>
        </Fragment>,
        onConfirm: buy
    })
}


interface SellControlsArgs {
    sellables: SellableStuff,
    self?: Actor5e,
    merchant: Actor5e,
    merchantFlag: MerchantFlag
    item: Item5e
}
function SellControls({sellables, merchant, self, item}: SellControlsArgs) {
    let found = sellables.items.find(x=>x.item === item)
    if(!self) return null
    return <>
        {item.isOwner && !found && <ItemControl title="Delete" icon="fas fa-trash" onClick={()=>item.delete()} />}
        {self  && <ItemControl title="Buy" icon="fas fa-hand-holding" onClick={()=>doBuy(self, merchant, item)} />}
    </>
}

interface ExtraProps {
    sellables: SellableStuff,
    merchant: Actor5e,
    self: Actor5e
}

const NewColumns = [
    ...DefaultItemColumns,
    {label: "", ColumnComponent: SellControls}
]

interface BuySheetArgs {
    self?: Actor,
    merchant: Actor,
    sellables: SellableStuff,
    merchantFlag: MerchantFlag,
    myGoldAmount: number
}
export default function BuySheet({self, merchant, sellables, merchantFlag, myGoldAmount}: BuySheetArgs) {
    let items = [...merchant.items.contents, ...sellables.items.map(x=>x.item)]

    return <Paper classes={{root: Styles.paperDiv}}>
        Buy:
        <NewItemTable extraData={{merchant, self, sellables}} columns={NewColumns} items={items} />
    </Paper>
}