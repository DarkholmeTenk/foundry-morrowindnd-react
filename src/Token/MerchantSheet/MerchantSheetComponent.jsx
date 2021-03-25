import {useNPC} from "../../Util/EntityHelper";
import {getMerchantFlag} from "./MerchantFlag";
import TokenPermission from "../../Util/Components/TokenPermission";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import MerchantFlagComponent from "./MerchantFlagComponent";
import {Paper} from "@material-ui/core";
import SellSheet from "./SellSheet";
import BuySheet from "./BuySheet";
import Styles from "./MerchantSheet.module.scss"

export default function MerchantSheetComponent({self: selfInput, merchant: merchantInput}) {
    let {value: self} = useNPC(selfInput)
    let {value: merchant} = useNPC(merchantInput)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = self ? getGoldAmountFromActor(self.data) : 0


    return <div>
        {merchant.owner ? <div className="flexrow">
            <MerchantFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag} />
            <TokenPermission token={merchant} />
        </div> : null }
        {self ? <Paper classes={{root: Styles.paperDiv}}>My Gold: <GoldDisplay value={myGoldAmount} /> </Paper> : null}
        <BuySheet self={self} merchant={merchant} merchantFlag={merchantFlag} myGoldAmount={myGoldAmount} />
        {self ? <SellSheet self={self} merchant={merchant} merchantFlag={merchantFlag} /> : null }
    </div>
}