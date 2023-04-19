import {BuyAction, getBuyActionData, MerchantBuy} from "Sheet/MerchantSheet/Buy/BuyAction";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import ItemViewer from "Util/Components/ItemViewer/ItemViewer";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {useContext} from "react";
import ApplicationContext from "Util/React/core/ApplicationContext";
import Styles from "./BuySheet.module.scss"

interface Props{
    action: Omit<BuyAction, "self">
}
export function BuyConfirmation({action}: Props) {
    let self = useNewSelf()!
    let app = useContext(ApplicationContext)
    let {merchant, mii, qty, price} = useSuspensePromise("buydata", ()=>getBuyActionData({...action, self: self.uuid}), [self])
    let doBuy = ()=>{
        MerchantBuy({...action, self: self.uuid})
        app.close()
    }
    return <div className={Styles.Confirmation}>
        <div className={Styles.Row}>
            <div>
                <h3>Purchaser</h3>
                <ItemViewer item={self} />
            </div>
            <div>
                <h3>Item</h3>
                <ItemViewer item={mii.item} />
            </div>
        </div>
        <div className={Styles.Row}>
            <div>
                <h3>Quantity</h3>
                <span>{qty}</span>
            </div>
            <div>
                <h3>Price</h3>
                <GoldDisplay value={price} />
            </div>
            <div>
                <h3>Available</h3>
                <GoldDisplay actor={self} />
            </div>
        </div>
        <div className={Styles.Row}>
            <Button onClick={doBuy}>Buy</Button>
        </div>
    </div>
}