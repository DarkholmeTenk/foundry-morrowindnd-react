import {getMerchantFlag} from "./Flag/MerchantFlag";
import MerchantFlagComponent from "./Flag/MerchantFlagComponent";
import SellSheet, {SellItem} from "./Sell/SellSheet";
import React, {useState} from "react"
import BuySheet from "./Buy/BuySheet";
import Styles from "./MerchantSheet.module.scss"
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {LeftFloatingPanel} from "Util/Components/LeftFloatingPanel/LeftFloatingPanel";
import {useMerchantActorInventory} from "./MerchantInventory/MerchantInventoryLoader";
import {chainSort, mapSort, StringSorter} from "Util/Sorting";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {onDrop} from "Util/Helper/DropHelper";
import {addItem} from "Util/Helper/ItemTransferHelper";
import {StateSetter} from "Util/React/update/Updater";
import {useArrayAdder} from "Util/Helper/ArrayReducers";
import {isPartyCargoHolder} from "Settings/token/TokenSettings";
import {openItemQuantitySelect} from "Sheet/LootSheet/ItemQuantitySelector";
import {Simulate} from "react-dom/test-utils";

import {openTokenLootDrop} from "Systems/TokenLootGenerator/TokenLootDrop";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";

let MIISorter = chainSort<MerchantInventoryItem>(
    mapSort(i=>i.item.type, StringSorter),
    mapSort(i=>i.item.type === "consumable" ? i.item.system.consumableType : "", StringSorter),
    mapSort(i=>i.item.name, StringSorter)
)

function useDropHandler(merchant: Actor5e, tab: "buy" | "sell", sellItems: SellItem[], setSellItems: StateSetter<SellItem[]>) {
    let addSellItem = useArrayAdder(setSellItems)
    let isOwner = merchant.isOwner
    let self = useNewSelf()
    return onDrop(async (i)=>{
        if(i instanceof RollTable) {
            openTokenLootDrop(merchant, i)
            return
        }
        if(!(i instanceof Item)) return
        if(tab === "buy") {
            if(isOwner) {
                await addItem(merchant, i._source)
            }
        } else {
            if(!self) return
            let item = i as Item5e
            let actor = item.actor
            if(!actor) return
            if(actor.uuid !== self.uuid && !isPartyCargoHolder(actor)) return
            if(sellItems.some(x=>x.item.uuid === item.uuid)) return
            let maxQty = item.qty(1)
            if(maxQty === 1)
                addSellItem({item, qty: 1})
            else
                openItemQuantitySelect({item, max: item.qty(), text: "How many to sell", onConfirm: (qty)=>addSellItem({item, qty}), buttonText: "Sell"})

        }
    })
}

interface Props {
    merchant: Actor5e
}
export default function MerchantSheetComponent({merchant}: Props) {
    let [tab, setTab] = useState<"buy" | "sell">("buy")
    let [sellItems, setSellItems] = useState<SellItem[]>([])

    let self = useNewSelf()
    useWatchEntity(merchant)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let sellableData = useMerchantActorInventory(merchant)
    let sorted = sellableData.sort(MIISorter)
    let dropHandler = useDropHandler(merchant, tab, sellItems, setSellItems)

    if(!self)
        return <div>Select yourself!</div>

    return <div onDrop={dropHandler}>
        {merchant.isOwner ? <LeftFloatingPanel>
            <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag}/>
        </LeftFloatingPanel> : null}
        <div className={Styles.MerchantSheet}>
            <div>
                <div>
                    <h3>{self.name}'s Available Gold</h3>
                    <GoldDisplay actor={self} />
                </div>
            </div>
            <hr />
            <div className={Styles.TabRow}>
                <Button onClick={()=>setTab("buy")} disabled={tab === "buy"}>Buy</Button>
                <Button onClick={()=>setTab("sell")} disabled={tab === "sell"}>Sell</Button>
            </div>
            <hr />
            {tab === "buy" && <BuySheet self={self} merchant={merchant} sellables={sorted} merchantFlag={merchantFlag} />}
            {tab === "sell" && <SellSheet self={self} merchant={merchant} merchantFlag={merchantFlag} items={sellItems} setItems={setSellItems} /> }
        </div>
    </div>
}