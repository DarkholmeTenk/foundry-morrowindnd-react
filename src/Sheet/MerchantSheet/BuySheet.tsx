import {getBuyPrice, MerchantFlag} from "./MerchantFlag";
import {MerchantBuy} from "./MerchantAction";
import {getActorId} from "../../Util/Identifiers/ActorID";
import {openItemQuantitySelect} from "../LootSheet/ItemQuantitySelector";
import React, {Fragment} from "react";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import {Paper} from "@material-ui/core";
import ItemTable from "../../Util/Components/ItemTable/ItemTable";
import {getItemId} from "../../Util/Identifiers/ItemID";
import {SellableItem} from "./Sellable/SellableData";
// @ts-ignore
import Styles from "./MerchantSheet.module.scss"
import {ItemColumnImage, ItemColumnName, ItemColumnWeight} from "../../Util/Components/ItemTable/ItemTableDefaults";
import {Control, generateControlsColumn, getEditControl} from "../../Util/Components/ItemTable/ItemTableControl";
import {SellableStuff} from "./MerchantSheetComponent";

function getGetQty(sellables: SellableItem[]): ((Item)=>number | undefined) {
    return (item: Item5e)=>{
        let found = sellables.find(x=>x.item === item)
        if(found) {
            return found.qty
        } else {
            return item.qty()
        }
    }
}

interface BuySheetArgs {
    self?: Actor5e,
    merchant: Actor5e,
    sellables: SellableStuff,
    merchantFlag: MerchantFlag,
    myGoldAmount: number
}
export default function BuySheet({self, merchant, sellables, merchantFlag, myGoldAmount}: BuySheetArgs) {
    let getQty = getGetQty(sellables.items)
    let buyControls = ({item}) => {
        let controls: Control[] = [getEditControl(item)]
        let found = sellables.items.find(x=>x.item === item)
        if (item.isOwner && !found) {
            controls.push({
                title: "Delete",
                text: <i className="fas fa-trash"/>,
                classes: "item-delete",
                onClick: () => item.delete()
            })
        }
        if (self) {
            let itemPrice = getBuyPrice(item, 1, merchantFlag)
            if (myGoldAmount >= itemPrice) {
                controls.push({
                    title: "Buy",
                    text: <i className="fas fa-hand-holding"/>,
                    onClick: () => {
                        let buy = (qty) => MerchantBuy({
                            self: getActorId(self),
                            merchant: getActorId(merchant),
                            item: getItemId(item),
                            qty
                        })
                        openItemQuantitySelect({
                            item,
                            max: Math.min(getQty(item) || 10, Math.floor(myGoldAmount / itemPrice)),
                            buttonText: (qty) => <Fragment>
                                Buy
                                <GoldDisplay value={getBuyPrice(item, qty, merchantFlag)}/>
                            </Fragment>,
                            onConfirm: buy
                        })
                    }
                })
            }
        }
        return controls
    }

    let columns = [
        ItemColumnImage,
        ItemColumnName,
        ItemColumnWeight,
        {
            title: "Qty",
            getter: ({item}) => getQty(item)
        },
        {
            title: "Price",
            getter: ({item}) => <GoldDisplay value={getBuyPrice(item, 1, merchantFlag)}/>
        },
        {
            title: "Value",
            getter: ({item}) => <GoldDisplay value={item.data.data.price}/>
        },
        generateControlsColumn(buyControls)
    ]

    return <Paper classes={{root: Styles.paperDiv}}>
        Buy:
        <ItemTable items={[...merchant.items.entries as any as Item5e[], ...sellables.items.map(x=>x.item)]} columns={columns}/>
    </Paper>
}