import {useNPC} from "../../Util/EntityHelper";
import {getMerchantFlag} from "./MerchantFlag";
import TokenPermission from "../../Util/Components/TokenPermission";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import MerchantFlagComponent from "./MerchantFlagComponent";
import {Paper} from "@material-ui/core";
import SellSheet from "./SellSheet";
import React from "react"
import BuySheet from "./BuySheet";
// @ts-ignore
import Styles from "./MerchantSheet.module.scss"
import {usePromise} from "../../Util/Helper/PromiseHelper";
import {SellableItem} from "./Sellable/SellableData";
import {loadSellable} from "./Sellable/SellableLoader";

export default function MerchantSheetComponent({self: selfInput, merchant: merchantInput}) {
    let {value: self} = useNPC(selfInput)
    let {value: merchant} = useNPC(merchantInput)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = self ? getGoldAmountFromActor(self.data) : 0
    let {loading: loadingSellables, result: sellableItems} = usePromise<SellableItem[]>(async ()=>{
        return merchantFlag.sellables ? await loadSellable({sellableId: merchantFlag.sellables}) : []
    }, [merchant])

    let buySheet = loadingSellables ? "Loading" : <BuySheet sellables={sellableItems} self={self} merchant={merchant} merchantFlag={merchantFlag} myGoldAmount={myGoldAmount} />
    let sellSheet = self ? <SellSheet self={self} merchant={merchant} merchantFlag={merchantFlag} /> : null

    return <div>
        {merchant.owner ? <div className="flexrow">
            <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag} />
            <TokenPermission token={merchant} />
        </div> : null }
        {self ? <Paper classes={{root: Styles.paperDiv}}>My Gold: <GoldDisplay value={myGoldAmount} /> </Paper> : null}
        {sellSheet}
        {buySheet}
    </div>
}