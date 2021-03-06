import {useNPC} from "../../Util/Helper/EntityHelper";
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
import useSelf from "../../Util/Components/SelfActorSelector";
import SelfComponent from "../Shared/SelfComponent";
import {getIdentifiableSellable, SellableSourceExtra} from "./Sellable/Settings";

export interface SellableStuff {
    items: SellableItem[],
    extra: SellableSourceExtra | null
}

export default function MerchantSheetComponent({self: selfInput, merchant: merchantInput}) {
    let {actor: self, component: selfSelector} = useSelf()
    let {value: merchant} = useNPC(merchantInput)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = self ? getGoldAmountFromActor(self.data) : 0
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

    let buySheet = loadingSellables ? "Loading" : <BuySheet sellables={sellableData} self={self} merchant={merchant} merchantFlag={merchantFlag} myGoldAmount={myGoldAmount} />
    let sellSheet = self ? <SellSheet self={self} merchant={merchant} merchantFlag={merchantFlag} /> : null

    return <div>
        {merchant.owner ? <div className="flexrow">
            <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag} />
            <TokenPermission token={merchant} />
        </div> : null }
        <SelfComponent self={self} selfSelector={selfSelector} />
        {sellSheet}
        {buySheet}
    </div>
}