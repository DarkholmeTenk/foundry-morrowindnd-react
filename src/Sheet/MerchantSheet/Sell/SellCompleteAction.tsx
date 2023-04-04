import {SellItem} from "./SellSheet";
import {StateSetter} from "../../../Util/React/update/Updater";
import {getSellPrice, MerchantFlag} from "../Flag/MerchantFlag";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {MerchantSell} from "./SellAction";
import {useArrayAdder} from "../../../Util/Helper/ArrayReducers";
import {loadActor} from "../../../Util/Identifiers/UuidHelper";
import {TokenSettings} from "../../../Token/TokenSettings";
import {getSellDesireItems} from "../../LootSheet/Desire/SellDesireButton";

type ACBProps = Pick<Props, "items" | "setItems" | "self">
export function AddCargoButton({self, items, setItems}: ACBProps) {
    let adder = useArrayAdder(setItems)
    let addCargo = ()=>{
        let cargoUuid = TokenSettings.value.sellLootDump
        if(!cargoUuid) return
        let cargo = loadActor.sync(cargoUuid)
        if(!cargo) return
        let newItems: SellItem[] = [...getSellDesireItems(cargo),...getSellDesireItems(self)].filter(y=>!items.some(x=>x.item.uuid === y.uuid)).map(q=>({item: q, qty: q.qty(1)}))
        adder(newItems)
    }
    return <button onClick={addCargo}>Add Cargo</button>
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
        <button onClick={sell}>Sell <GoldDisplay value={totalValue}/></button>
        <AddCargoButton items={items} setItems={setItems} self={self} />
    </div>
}