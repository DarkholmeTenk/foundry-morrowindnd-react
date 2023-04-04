import {getMerchantFlag, MerchantFlag} from "./Flag/MerchantFlag";
import TokenPermission from "../../Util/Components/TokenPermission";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import MerchantFlagComponent from "./Flag/MerchantFlagComponent";
import SellSheet from "./Sell/SellSheet";
import React, {useReducer, useState} from "react"
import BuySheet from "./Buy/BuySheet";
// @ts-ignore
import Styles from "./MerchantSheet.module.scss"
import {usePromise} from "../../Util/Helper/PromiseHelper";
import {loadSellable} from "./MerchantInventory/Config/MerchantInventoryConfigLoader";
import {getIdentifiableSellable, SellableSourceExtra} from "./MerchantInventory/Settings";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";
import {useWatchEntity} from "../../Util/Helper/EntityHelper";
import {LeftFloatingPanel} from "../../Util/Components/LeftFloatingPanel/LeftFloatingPanel";
import {loadMerchantInventory, useMerchantActorInventory} from "./MerchantInventory/MerchantInventoryLoader";

interface LoadedProps {
    self: Actor5e
    merchant: Actor5e
    merchantFlag: MerchantFlag
    sellable: MerchantInventoryItem[]
}
function Loaded({self, merchant, merchantFlag, sellable}: LoadedProps) {
    let [tab, setTab] = useState<"buy" | "sell">("buy")

    let TabContents = tab === "buy" ? BuySheet : SellSheet
    return <div>
        <div className={Styles.TabRow}>
            <button onClick={()=>setTab("buy")} disabled={tab === "buy"}>Buy</button>
            <button onClick={()=>setTab("sell")} disabled={tab === "sell"}>Sell</button>
        </div>
        <hr />
        <TabContents merchant={merchant} sellables={sellable} merchantFlag={merchantFlag} self={self} />
    </div>
}

interface Props {
    merchant: Actor5e
}
export default function MerchantSheetComponent({merchant}: Props) {
    let [value, refresh] = useReducer((x)=>x+1, 0)
    let self = useNewSelf()
    useWatchEntity(merchant, refresh)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let {loading: loadingSellables, result: sellableData} = useMerchantActorInventory(merchant)

    console.log("MSC", loadingSellables, sellableData, self)
    if(!self) return <div>Select yourself!</div>

    return <div>
        {merchant.isOwner ? <LeftFloatingPanel>
            <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag}/>
        </LeftFloatingPanel> : null}
        <div className={Styles.MerchantSheet}>
            {(!loadingSellables && sellableData) ? <Loaded self={self} merchant={merchant} merchantFlag={merchantFlag} sellable={sellableData} /> : null }
        </div>
    </div>
}