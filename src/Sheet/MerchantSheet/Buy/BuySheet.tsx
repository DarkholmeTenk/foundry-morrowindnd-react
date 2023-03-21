import {getBuyPrice, getMerchantFlag, MerchantFlag} from "../Flag/MerchantFlag";
import {openItemQuantitySelect} from "../../LootSheet/ItemQuantitySelector";
import React, {Fragment} from "react";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {Paper} from "@material-ui/core";
// @ts-ignore
import Styles from "../MerchantSheet.module.scss"
import {ItemControl} from "../../../Util/Components/NewItemTable/Item/ItemControls";
import {getGoldAmountFromActor} from "../../../Util/Helper/GoldHelper";
import {NewItemTable} from "../../../Util/Components/NewItemTable/NewItemTable";
import {MerchantBuy} from "./BuyAction";
import {DefaultMIICols} from "../MerchantInventory/Item/MerchantInventoryItemDefaultCols";
import {miiPrice, miiQty} from "../MerchantInventory/Item/MerchantInventoryItemData";

function toBuyData({item, type, qty}: MerchantInventoryItem) {
    if(type === "item5e")
        return {type, item: item.uuid, qty}
    else
        return {type, item, qty}
}

function doBuy(self: Actor5e, merchant: Actor5e, item: MerchantInventoryItem) {
    let [merchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = getGoldAmountFromActor(self)
    let itemPrice = getBuyPrice(item, 1, merchantFlag)
    let buy = (qty) => MerchantBuy({
        self: self.uuid,
        merchant: merchant.uuid,
        item: toBuyData(item),
        qty
    })
    openItemQuantitySelect({
        item: item.item,
        max: Math.min(miiQty(item), Math.floor(myGoldAmount / itemPrice)),
        buttonText: (qty) => <Fragment>
            Buy
            <GoldDisplay value={getBuyPrice(item, qty, merchantFlag)}/>
        </Fragment>,
        onConfirm: buy
    })
}


interface SellControlsArgs {
    self?: Actor5e,
    merchant: Actor5e,
    merchantFlag: MerchantFlag
    item: MerchantInventoryItem
}
function SellControls({merchant, self, item}: SellControlsArgs) {
    if(!self) return null
    let itemResult = item.item
    let canAfford = getGoldAmountFromActor(self) > miiPrice(item)
    return <>
        {(merchant.isOwner && itemResult instanceof Item) ? <ItemControl title="Delete" icon="fas fa-trash" onClick={()=>(itemResult as Item5e).delete()} /> : null}
        {canAfford && <ItemControl title="Buy" icon="fas fa-hand-holding" onClick={()=>doBuy(self, merchant, item)} />}
    </>
}

interface ExtraProps {
    sellables: MerchantInventoryItem[],
    merchant: Actor5e,
    self: Actor5e
}

const NewColumns = [
    ...DefaultMIICols,
    {label: "", ColumnComponent: SellControls}
]

interface BuySheetArgs {
    self?: Actor,
    merchant: Actor,
    sellables: MerchantInventoryItem[],
    merchantFlag: MerchantFlag,
    myGoldAmount: number
}
export default function BuySheet({self, merchant, sellables, merchantFlag, myGoldAmount}: BuySheetArgs) {

    return <Paper classes={{root: Styles.paperDiv}}>
        Buy:
        <NewItemTable extraData={{merchant, self, sellables}} columns={NewColumns} items={sellables} />
    </Paper>
}