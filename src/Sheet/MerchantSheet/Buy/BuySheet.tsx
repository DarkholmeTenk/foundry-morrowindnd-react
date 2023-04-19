import {getBuyPrice, getMerchantFlag, MerchantFlag} from "../Flag/MerchantFlag";
import {openItemQuantitySelect} from "../../LootSheet/ItemQuantitySelector";
import React, {Fragment, MouseEvent, useState} from "react";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import {getGoldAmountFromActor} from "Util/Helper/GoldHelper";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import {MerchantBuy} from "./BuyAction";
import {DefaultMIICols, MIIExpander} from "../MerchantInventory/Item/MerchantInventoryItemDefaultCols";
import {miiQty} from "../MerchantInventory/Item/MerchantInventoryItemData";
import {MerchantInventoryItemFilter} from "Sheet/MerchantSheet/Buy/BuyFilter";
import {useMoneyRequest} from "Systems/GroupPay/useMoneyRequest";
import {BuyIcon, DeleteIcon, RequestMoneyIcon, ViewIcon} from "Util/Components/SimpleComponents/IconLibrary";
import {RequestMoneyButton} from "Systems/GroupPay/RequestMoneyButton";
import {BuyQtyInput} from "Sheet/MerchantSheet/Buy/BuyQtyInput";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {openReactApplication} from "Util/React/openReactApplication";
import {BuyConfirmation} from "Sheet/MerchantSheet/Buy/BuyConfirmation";

function toBuyData({item, type, qty}: MerchantInventoryItem) {
    if(type === "item5e")
        return {type, item: item.uuid, qty}
    else
        return {type, item, qty}
}

function doBuy(e: MouseEvent<unknown>, self: Actor5e, merchant: Actor5e, item: MerchantInventoryItem, qty: number) {
    let action = {merchant: merchant.uuid, item: toBuyData(item), qty, self: self.uuid}
    if(e.shiftKey)
        MerchantBuy(action)
    else
        openReactApplication(<BuyConfirmation action={action} />, {width: 450, height: 250, title: "Buying " + item.item.name})
}

interface BuyControlsArgs {
    self?: Actor5e,
    merchant: Actor5e,
    merchantFlag: MerchantFlag
    item: MerchantInventoryItem
}
function BuyControls({merchant, self, item, merchantFlag}: BuyControlsArgs) {
    let itemResult = item.item
    let qty = miiQty(item)
    let [amount, setAmount] = useState(1)
    let updateAmount = (newAmount)=>{
        setAmount(Math.max(1, Math.min(newAmount, qty)))
    }

    if(!self) return null
    let buyPrice = getBuyPrice(item, amount, merchantFlag)
    let canAfford = getGoldAmountFromActor(self) >= getBuyPrice(item, amount, merchantFlag)
    return <>
        <BuyQtyInput value={amount} setValue={updateAmount} max={qty} />
        <Button tooltip={<div>Buy <GoldDisplay value={buyPrice} /> </div>} icon={BuyIcon} disabled={!canAfford} onClick={(e)=>doBuy(e, self, merchant, item, amount)} />
        <RequestMoneyButton amount={buyPrice} purpose={"To purchase " + amount + "*" + item.item.name} />
        {item.type === "item5e" ? <ItemControl title="Open" icon={ViewIcon} onClick={() => item.item.sheet?.render(true)}/> : null}
        {(merchant.isOwner && itemResult instanceof Item && itemResult.parent === merchant) ? <ItemControl title="Delete" icon={DeleteIcon} onClick={()=>(itemResult as Item5e).delete()} /> : null}
    </>
}

interface ExtraProps {
    sellables: MerchantInventoryItem[],
    merchant: Actor5e,
    self: Actor5e
}

const NewColumns = [
    ...DefaultMIICols,
    {label: "", ColumnComponent: BuyControls, cellProps: {width: 170}}
]

interface BuySheetArgs {
    self?: Actor,
    merchant: Actor,
    sellables: MerchantInventoryItem[],
    merchantFlag: MerchantFlag,
}
export default function BuySheet({self, merchant, sellables, merchantFlag}: BuySheetArgs) {
    return <NewItemTable filter={MerchantInventoryItemFilter} extraData={{merchant, self, sellables, merchantFlag}} columns={NewColumns} expander={MIIExpander} items={sellables} />
}