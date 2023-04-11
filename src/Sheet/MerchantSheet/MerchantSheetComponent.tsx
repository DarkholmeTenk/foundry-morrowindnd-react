import {getMerchantFlag} from "./Flag/MerchantFlag";
import MerchantFlagComponent from "./Flag/MerchantFlagComponent";
import SellSheet from "./Sell/SellSheet";
import React, {useReducer, useState} from "react"
import BuySheet from "./Buy/BuySheet";
import Styles from "./MerchantSheet.module.scss"
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {LeftFloatingPanel} from "Util/Components/LeftFloatingPanel/LeftFloatingPanel";
import {useMerchantActorInventory} from "./MerchantInventory/MerchantInventoryLoader";
import {chainSort, mapSort, StringSorter} from "Util/Sorting";
import {Button} from "Util/Components/SimpleComponents";

let MIISorter = chainSort<MerchantInventoryItem>(
    mapSort(i=>i.item.type, StringSorter),
    mapSort(i=>i.item.type === "consumable" ? i.item.system.consumableType : "", StringSorter),
    mapSort(i=>i.item.name, StringSorter)
)

interface Props {
    merchant: Actor5e
}
export default function MerchantSheetComponent({merchant}: Props) {
    let [value, refresh] = useReducer((x)=>x+1, 0)
    let self = useNewSelf()
    useWatchEntity(merchant, refresh)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let sellableData = useMerchantActorInventory(merchant)
    let [tab, setTab] = useState<"buy" | "sell">("buy")
    let sorted = sellableData.sort(MIISorter)


    if(!self) return <div>Select yourself!</div>

    let TabContents = tab === "buy" ? BuySheet : SellSheet
    return <div>
        {merchant.isOwner ? <LeftFloatingPanel>
            <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag}/>
        </LeftFloatingPanel> : null}
        <div className={Styles.MerchantSheet}>
            <div className={Styles.TabRow}>
                <Button onClick={()=>setTab("buy")} disabled={tab === "buy"}>Buy</Button>
                <Button onClick={()=>setTab("sell")} disabled={tab === "sell"}>Sell</Button>
            </div>
            <hr />
            <TabContents merchant={merchant} sellables={sellableData} merchantFlag={merchantFlag} self={self} />
        </div>
    </div>
}