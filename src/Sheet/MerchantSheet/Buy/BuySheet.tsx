import {getBuyPrice, getMerchantFlag, MerchantFlag} from "../Flag/MerchantFlag";
import {openItemQuantitySelect} from "../../LootSheet/ItemQuantitySelector";
import React, {Fragment} from "react";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import {getGoldAmountFromActor} from "Util/Helper/GoldHelper";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import {MerchantBuy} from "./BuyAction";
import {DefaultMIICols, MIIExpander} from "../MerchantInventory/Item/MerchantInventoryItemDefaultCols";
import {miiQty} from "../MerchantInventory/Item/MerchantInventoryItemData";
import {MerchantInventoryItemFilter} from "Sheet/MerchantSheet/Buy/BuyFilter";
import {useMoneyRequest} from "Systems/GroupPay/useMoneyRequest";

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

interface BuyControlsArgs {
    self?: Actor5e,
    merchant: Actor5e,
    merchantFlag: MerchantFlag
    item: MerchantInventoryItem
}
function BuyControls({merchant, self, item, merchantFlag}: BuyControlsArgs) {
    if(!self) return null
    let itemResult = item.item
    let buyPrice = getBuyPrice(item, 1, merchantFlag)
    let canAfford = getGoldAmountFromActor(self) >= getBuyPrice(item, 1, merchantFlag)
    let {canRequestMoney, requestMoney} = useMoneyRequest()
    return <>
        {item.type === "item5e" ? <ItemControl title="Open" icon="fas fa-eye" onClick={() => item.item.sheet?.render(true)}/> : null}
        {(merchant.isOwner && itemResult instanceof Item) ? <ItemControl title="Delete" icon="fas fa-trash" onClick={()=>(itemResult as Item5e).delete()} /> : null}
        {canAfford && <ItemControl title="Buy" icon="fas fa-cart-plus" onClick={()=>doBuy(self, merchant, item)} />}
        {canRequestMoney && <ItemControl title="Request money from party" icon="fa-solid fa-money-bill-wave" onClick={()=>requestMoney(buyPrice, "To purchase " + item.item.name)} />}
    </>
}

interface ExtraProps {
    sellables: MerchantInventoryItem[],
    merchant: Actor5e,
    self: Actor5e
}

const NewColumns = [
    ...DefaultMIICols,
    {label: "", ColumnComponent: BuyControls}
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