import {SellItem} from "./SellSheet";
import {StateSetter} from "Util/React/update/Updater";
import {getSellPrice, MerchantFlag} from "../Flag/MerchantFlag";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {MerchantSell} from "./SellAction";
import {useArrayAdder} from "Util/Helper/ArrayReducers";
import {getPartyCargoHolder} from "Settings/token/TokenSettings";
import {getSellDesireItems} from "../../LootSheet/Desire/SellDesireButton";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {Button} from "Util/Components/SimpleComponents";

type ACBProps = Pick<Props, "items" | "setItems" | "self">
export function AddCargoButton({self, items, setItems}: ACBProps) {
    let cargo = getPartyCargoHolder()
    useWatchEntity(cargo)
    let hasCargo = cargo && getSellDesireItems(cargo).length > 0
    let adder = useArrayAdder(setItems)
    if(!hasCargo) return null
    let addCargo = ()=>{
        if(!cargo) return
        let newItems: SellItem[] = [...getSellDesireItems(cargo),...getSellDesireItems(self)].filter(y=>!items.some(x=>x.item.uuid === y.uuid)).map(q=>({item: q, qty: q.qty(1)}))
        adder(newItems)
    }
    return <Button onClick={addCargo}>Add Cargo</Button>
}

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
        <Button onClick={sell}>Sell <GoldDisplay value={totalValue}/></Button>
        <AddCargoButton items={items} setItems={setItems} self={self} />
    </div>
}