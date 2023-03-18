import {TokenSettings} from "../../../Token/TokenSettings";
import {Button, CircularProgress, FormGroup} from "@material-ui/core";
import {hasSellFlag} from "./SellDesire";
import {getSellPrice} from "../../MerchantSheet/MerchantFlag";
import {useCallback, useState} from "react";
import {useUserGroupSelector} from "../../../Util/Helper/UserHelper";
import {MerchantSellJunk} from "../../MerchantSheet/MerchantAction";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {useWatchedUuid} from "../../../Util/Helper/EntityHelper";
import {isActor} from "../../../Util/Identifiers/UuidHelper";
import {itemQty} from "../../../Util/Extension/Items";

export function getSellDesireItems(actor: Actor): Item[] {
    return actor.items.filter(i=>hasSellFlag(i))
}

export default function SellDesireButton({merchant, merchantFlag}) {
    let [sellLootDumpId] = useState(TokenSettings.value.sellLootDump)
    let {component, selectedUsers} = useUserGroupSelector({defaultState: true})
    let sell = useCallback(()=>MerchantSellJunk({merchant: merchant.uuid, users: selectedUsers.map(x=>x.id!)}), [merchant, selectedUsers])
    let {result: value, loading} = useWatchedUuid(sellLootDumpId, isActor)

    if(loading) return <CircularProgress />
    if(value) {
        let sellItems = getSellDesireItems(value)
        if(sellItems.length === 0) {
            return null
        } else {
            let totalValue = sellItems.reduce((p, c)=> p + getSellPrice(c, itemQty(c), merchantFlag), 0)
            return <FormGroup title="Junk Selling">
                {component}
                <Button onClick={sell} disabled={selectedUsers.length == 0}>Sell Junk on {value.name}: <GoldDisplay value={totalValue} /></Button>
            </FormGroup>
        }
    } else {
        return null
    }
}