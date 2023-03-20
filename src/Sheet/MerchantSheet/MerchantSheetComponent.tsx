import {getMerchantFlag} from "./Flag/MerchantFlag";
import TokenPermission from "../../Util/Components/TokenPermission";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import MerchantFlagComponent from "./Flag/MerchantFlagComponent";
import SellSheet from "./Sell/SellSheet";
import React from "react"
import BuySheet from "./Buy/BuySheet";
// @ts-ignore
import Styles from "./MerchantSheet.module.scss"
import {usePromise} from "../../Util/Helper/PromiseHelper";
import {SellableItem} from "./MerchantInventory/SellableData";
import {loadSellable} from "./MerchantInventory/SellableLoader";
import {getIdentifiableSellable, SellableSourceExtra} from "./MerchantInventory/Settings";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";
import {useWatchEntity} from "../../Util/Helper/EntityHelper";

export interface SellableStuff {
    items: SellableItem[],
    extra: SellableSourceExtra | null
}

interface Props {
    merchant: Actor5e
}
export default function MerchantSheetComponent({merchant}: Props) {
    let self = useNewSelf()
    useWatchEntity(merchant)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = self ? getGoldAmountFromActor(self) : 0
    let {loading: loadingSellables, result: sellableData} = usePromise<SellableStuff>(async ()=>{
        let identifiableSellable = merchantFlag.sellables ? getIdentifiableSellable(merchantFlag.sellables) : undefined
        if(identifiableSellable) {
            let items = await loadSellable(identifiableSellable)
            return {
                items,
                extra: identifiableSellable
            }
        } else {
            return {
                items: [],
                extra: null
            }
        }
    }, [merchant])

    if(self) {
        let buySheet = (loadingSellables || !sellableData) ? "Loading" :
            <BuySheet sellables={sellableData} self={self!} merchant={merchant} merchantFlag={merchantFlag}
                      myGoldAmount={myGoldAmount}/>
        let sellSheet = self ? <SellSheet self={self} merchant={merchant} merchantFlag={merchantFlag}/> : null

        return <div>
            {merchant.isOwner ? <div className="flexrow">
                <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag}/>
            </div> : null}
            {sellSheet}
            {buySheet}
        </div>
    } else {
        return <div>Select yourself</div>
    }
}