import {SellItem} from "./SellSheet";
import {StateSetter} from "../../../Util/React/update/Updater";
import {getSellPrice, MerchantFlag} from "../Flag/MerchantFlag";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {MerchantSell} from "./SellAction";

interface Props {
    items: SellItem[]
    setItems: StateSetter<SellItem[]>
    self: Actor5e
    merchant: Actor5e
    merchantFlag: MerchantFlag
}
export function SellCompleteAction({items, setItems, self, merchant, merchantFlag}: Props) {
    let totalValue = items.reduce((p, c)=>p + getSellPrice(c.item, c.qty, merchantFlag), 0)
    let sell = async ()=>{
        let sitems = items.map((i)=>({itemId: i.item.uuid, qty: i.qty}))
        MerchantSell({merchant: merchant.uuid, items: sitems})
        setItems([])
    }
    return <div>
        <button onClick={sell}>Sell <GoldDisplay value={totalValue}/></button>
    </div>
}