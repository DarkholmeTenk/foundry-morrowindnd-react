import {TokenSettings} from "../../../Token/TokenSettings";
import {useActor} from "../../../Util/Helper/EntityHelper";
import {Button, CircularProgress, FormGroup} from "@material-ui/core";
import {hasSellFlag} from "./SellDesire";
import {getSellPrice} from "../../MerchantSheet/MerchantFlag";
import {useCallback, useState} from "react";
import {getActorId} from "../../../Util/Identifiers/ActorID";
import {useUserGroupSelector} from "../../../Util/Helper/UserHelper";
import {MerchantSellJunk} from "../../MerchantSheet/MerchantAction";
import GoldDisplay from "../../../Util/Components/GoldDisplay";

export function getSellDesireItems(actor: Actor): Item<any>[] {
    return actor.items.filter(i=>hasSellFlag(i))
}

export default function SellDesireButton({merchant, merchantFlag}) {
    let [sellLootDumpId] = useState(TokenSettings.value.sellLootDump)
    let {component, selectedUsers} = useUserGroupSelector({defaultState: true})
    let sell = useCallback(()=>MerchantSellJunk({merchant: getActorId(merchant), users: selectedUsers.map(x=>x.id)}), [merchant, selectedUsers])
    let {value, loading} = useActor(sellLootDumpId)

    if(loading) return <CircularProgress />
    if(value) {
        let sellItems = getSellDesireItems(value)
        if(sellItems.length === 0) {
            return null
        } else {
            let totalValue = sellItems.reduce((p, c)=> p + getSellPrice(c, c.data.data.quantity, merchantFlag), 0)
            return <FormGroup title="Junk Selling">
                {component}
                <Button onClick={sell} disabled={selectedUsers.length == 0}>Sell Junk on {value.name}: <GoldDisplay value={totalValue} /></Button>
            </FormGroup>
        }
    } else {
        return null
    }
}