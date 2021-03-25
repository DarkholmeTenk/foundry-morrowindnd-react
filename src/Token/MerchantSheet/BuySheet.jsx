import {getBuyPrice} from "./MerchantFlag";
import {MerchantBuy} from "./MerchantAction";
import {getActorId} from "../../Util/Identifiers/ActorID";
import {openItemQuantitySelect} from "../LootSheet/ItemQuantitySelector";
import {Fragment} from "react";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import {Paper} from "@material-ui/core";
import {ItemTable} from "../../Util/Components/ItemTable";
import Styles from "./MerchantSheet.module.scss"

export default function BuySheet({self, merchant, merchantFlag, myGoldAmount}) {
    let buyControls = (item) => {
        let controls = []
        if (item.owner) {
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
                    title: "Buy", text: <i className="fas fa-hand-holding"/>, onClick: () => {
                        let buy = (qty) => MerchantBuy({
                            self: getActorId(self),
                            item: {actorId: getActorId(merchant), itemId: item.id},
                            qty
                        })
                        openItemQuantitySelect({
                            item,
                            max: Math.min(item.data.data.quantity, Math.floor(myGoldAmount / itemPrice)),
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

    let extraColumns = [
        {
            title: "Price",
            getter: (i) => <GoldDisplay value={getBuyPrice(i, 1, merchantFlag)}/>
        },
        {
            title: "Value",
            getter: (i) => <GoldDisplay value={i.data.data.price}/>

        }
    ]
    return <Paper classes={{root: Styles.paperDiv}}>
        Buy:
        <ItemTable items={merchant.items.entries} controls={buyControls} extraColumns={extraColumns}/>
    </Paper>
}