import GoldDisplay from "../../Util/Components/GoldDisplay";
import {Button, Card, CardActions, CardContent, Input, Typography} from "@material-ui/core";
import React, {useCallback, useState} from "react";
import {getGoldDetails, useLootSheetFlag} from "./LootSheetGoldUtil";
import {LootSplitGold} from "./LootAction";
import {addGold, removeGold} from "../../Util/Helper/GoldHelper";
import {UserGroupSelector} from "../../Util/Helper/UserHelper";

export default function GoldSection({npc, disabled}) {
    let {flag, setFlag} = useLootSheetFlag(npc)

    let {takers, amount, splitAmount, takeCount} = getGoldDetails(npc)
    let [newGold, setNewGold] = useState("0")
    let setTakers=useCallback((takerUpdate)=> {
        setFlag({...flag, goldTakers: takerUpdate(flag.goldTakers || {})})
    }, [takers, setFlag])
    let loot = useCallback(()=>{
        LootSplitGold({lootId: npc.uuid})
    }, [npc])
    let setGold = useCallback(async ()=>{
        let ng = parseFloat(newGold)
        if(ng > 0) {
            await addGold(npc, ng)
        } else if(ng < 0) {
            await removeGold(npc, -ng)
        }
    }, [newGold])
    let owner = npc.isOwner

    return <Card>
        <CardContent>
            <Typography>Gold Loot</Typography>
            <UserGroupSelector selected={takers} setSelected={setTakers} disabled={disabled} />
            <div>
                Total:
                <GoldDisplay value={amount} />
            </div>
            <div>
                Split:
                <GoldDisplay value={splitAmount} />
            </div>
            {owner ? <div>
                <Input title="Add Gold" value={newGold} onChange={(e)=>setNewGold(e.target.value)} />
            </div> : null}
        </CardContent>
        <CardActions>
            <Button size="small" disabled={takeCount === 0 || amount === 0} onClick={loot}>Loot Gold</Button>
            {owner ? <Button size="small" onClick={setGold}>Add Gold</Button> : null}
        </CardActions>
    </Card>
}
