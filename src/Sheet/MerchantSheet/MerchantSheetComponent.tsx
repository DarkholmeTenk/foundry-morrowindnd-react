import {getMerchantFlag} from "./MerchantFlag";
import TokenPermission from "../../Util/Components/TokenPermission";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import MerchantFlagComponent from "./MerchantFlagComponent";
import SellSheet from "./SellSheet";
import React from "react"
import BuySheet from "./BuySheet";
// @ts-ignore
import Styles from "./MerchantSheet.module.scss"
import {usePromise} from "../../Util/Helper/PromiseHelper";
import {SellableItem} from "./Sellable/SellableData";
import {loadSellable} from "./Sellable/SellableLoader";
import {getIdentifiableSellable, SellableSourceExtra} from "./Sellable/Settings";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";
import {useWatchEntity} from "../../Util/Helper/EntityHelper";

export interface SellableStuff {
    items: SellableItem[],
    extra: SellableSourceExtra | null
}

export default function MerchantSheetComponent({merchant}: {merchant: Actor5e}) {
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
                <TokenPermission token={merchant}/>
            </div> : null}
            {sellSheet}
            {buySheet}
        </div>
    } else {
        return <div>Select yourself</div>
    }
}