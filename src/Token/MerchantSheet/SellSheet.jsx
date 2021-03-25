import {Fragment, useState} from "react";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import {getSellPrice} from "./MerchantFlag";
import {onDrop} from "@darkholme/foundry-react-core/src/Util/DropHelper";
import {openItemQuantitySelect} from "../LootSheet/ItemQuantitySelector";
import {getActorId} from "../../Util/Identifiers/ActorID";
import {MerchantSell} from "./MerchantAction";
import {Button, Paper} from "@material-ui/core";
import {ItemTable} from "../../Util/Components/ItemTable";
import Styles from "./MerchantSheet.module.scss"

export default function SellSheet({self, merchant, merchantFlag}) {
    let [items, setItems] = useState([])
    let sellControls = (item, index) => {
        let remove = () => {
            let newArr = [...items];
            newArr.splice(index, 1);
            setItems(newArr);
        }
        let controls = [
            {title: "Delete", text: <i className="fas fa-trash"/>, classes: "item-delete", onClick: remove}
        ]
        return controls
    }

    let extraColumns = [
        {
            title: "Selling",
            getter: (i, c, x, index) => items[index].qty
        },
        {
            title: "Sell Price",
            getter: (i, c, x, index) => <GoldDisplay value={getSellPrice(i, items[index].qty, merchantFlag)}/>
        },
        {
            title: "Value",
            getter: (i) => <GoldDisplay value={i.data.data.price}/>
        }
    ]

    let onDropFunction = onDrop((item) => {
        if (item instanceof Item && item.actor?.id === self.id) {
            openItemQuantitySelect({
                item,
                max: Math.min(item.data.data.quantity),
                buttonText: (qty) => <Fragment>
                    Add
                    <GoldDisplay value={getSellPrice(item, qty, merchantFlag)}/>
                </Fragment>,
                onConfirm: (qty) => setItems([...items, {item, qty}])
            })
        }
    })

    let sell = async () => {
        let actorId = getActorId(self)
        let sellBlobs = items.map(i => {
            return {itemId: {actorId, itemId: i.item.id}, qty: i.qty}
        })
        MerchantSell({merchant: getActorId(merchant), items: sellBlobs})
        setItems([])
    }

    let totalValue = items.map(i => getSellPrice(i.item, i.qty, {...merchantFlag, sellRate: 1})).reduce((p,c)=>p+c,0)
    let totalPrice = items.map(i => getSellPrice(i.item, i.qty, merchantFlag)).reduce((p,c)=>p+c,0)

    return <Paper classes={{root: Styles.paperDiv}} onDrop={onDropFunction}>
        <div className="flexrow">
            Sell:
            <Button onClick={()=>self.sheet.render(true)}>
                Open Character Sheet
            </Button>
        </div>
        {items.length > 0 ? <ItemTable items={items.map(i => i.item)} controls={sellControls}
                                       extraColumns={extraColumns}/> : "Drop Items Here"}
        <Button onClick={sell}>
            Sell
            <GoldDisplay value={totalPrice}/>
            [ <GoldDisplay value={totalValue}/> ]
        </Button>
    </Paper>
}