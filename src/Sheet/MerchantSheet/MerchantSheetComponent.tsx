import {getMerchantFlag} from "./Flag/MerchantFlag";
import TokenPermission from "../../Util/Components/TokenPermission";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import MerchantFlagComponent from "./Flag/MerchantFlagComponent";
import SellSheet from "./Sell/SellSheet";
import React, {useReducer} from "react"
import BuySheet from "./Buy/BuySheet";
// @ts-ignore
import Styles from "./MerchantSheet.module.scss"
import {usePromise} from "../../Util/Helper/PromiseHelper";
import {loadSellable} from "./MerchantInventory/Config/MerchantInventoryConfigLoader";
import {getIdentifiableSellable, SellableSourceExtra} from "./MerchantInventory/Settings";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";
import {useWatchEntity} from "../../Util/Helper/EntityHelper";
import {LeftFloatingPanel} from "../../Util/Components/LeftFloatingPanel/LeftFloatingPanel";
import {loadMerchantInventory} from "./MerchantInventory/MerchantInventoryLoader";

interface Props {
    merchant: Actor5e
}
export default function MerchantSheetComponent({merchant}: Props) {
    let [value, refresh] = useReducer((x)=>x+1, 0)
    let self = useNewSelf()
    useWatchEntity(merchant, refresh)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = self ? getGoldAmountFromActor(self) : 0
    let {loading: loadingSellables, result: sellableData} = usePromise<MerchantInventoryItem[]>(async ()=>{
        return loadMerchantInventory(merchant)
    }, [merchant, value])

    if(!self) return <div>Select yourself!</div>

    let buySheet = (loadingSellables || !sellableData) ? "Loading" :
        <BuySheet sellables={sellableData} self={self!} merchant={merchant} merchantFlag={merchantFlag}
                  myGoldAmount={myGoldAmount}/>
    let sellSheet = self ? <SellSheet self={self} merchant={merchant} merchantFlag={merchantFlag}/> : null

    return <div>
        {merchant.isOwner ? <LeftFloatingPanel>
            <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag}/>
        </LeftFloatingPanel> : null}
        {sellSheet}
        {buySheet}
    </div>
}