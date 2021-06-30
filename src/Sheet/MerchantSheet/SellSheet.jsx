import {Fragment, useState} from "react";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import {getSellPrice} from "./MerchantFlag";
import {openItemQuantitySelect} from "../LootSheet/ItemQuantitySelector.tsx";
import {getActorId} from "../../Util/Identifiers/ActorID";
import {MerchantSell} from "./MerchantAction";
import {Button, Paper} from "@material-ui/core";
import ItemTable from "../../Util/Components/ItemTable/ItemTable";
import Styles from "./MerchantSheet.module.scss"
import {onDrop} from "../../Util/Helper/DropHelper";
import {ItemColumnDefaults} from "../../Util/Components/ItemTable/ItemTableDefaults";
import {generateControlsColumn} from "../../Util/Components/ItemTable/ItemTableControl";
import SellDesireButton from "../LootSheet/Desire/SellDesireButton";


export default function SellSheet({self, merchant, merchantFlag}) {
    let [items, setItems] = useState([])
    let sellControls = ({index}) => {
        let remove = () => {
            let newArr = [...items];
            newArr.splice(index, 1);
            setItems(newArr);
        }
        return [
            {title: "Delete", text: <i className="fas fa-trash"/>, classes: "item-delete", onClick: remove}
        ]
    }

    let columns = [
        ...ItemColumnDefaults,
        {
            title: "Selling",
            getter: ({index}) => items[index].qty
        },
        {
            title: "Sell Price",
            getter: ({item, index}) => <GoldDisplay value={getSellPrice(item, items[index].qty, merchantFlag)}/>
        },
        {
            title: "Value",
            getter: ({item}) => <GoldDisplay value={item.data.data.price}/>
        },
        generateControlsColumn(sellControls)
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
        <SellDesireButton merchant={merchant} merchantFlag={merchantFlag}/>
        <div className="flexrow">
            Sell:
            <Button onClick={()=>self.sheet.render(true)}>
                Open Character Sheet
            </Button>
        </div>
        {items.length > 0 ? <ItemTable items={items.map(i => i.item)} columns={columns}/> : "Drop Items Here"}
        <Button onClick={sell}>
            Sell
            <GoldDisplay value={totalPrice}/>
            [ <GoldDisplay value={totalValue}/> ]
        </Button>
    </Paper>
}