import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {Input, Typography} from "@mui/material";
import React, {useCallback, useState} from "react";
import {addGold, removeGold} from "Util/Helper/GoldHelper";
import {getLootFlag, getLootGoldDetails} from "../LootFlags";
import {LootSplitGold} from "./SplitGoldAction";
import {LeftFloatingPanel} from "Util/Components/LeftFloatingPanel/LeftFloatingPanel";
import {useMappedSetter, useSafeSetter, useSetter} from "Util/React/update/Updater";
import {PartyActorSelector} from "Util/Components/PartyActorSelector/PartyActorSelector";
import {getPartyUUIDs} from "Settings/token/TokenSettings";
import Styles from "./GoldSection.module.scss"
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

export default function GoldSection({npc, disabled}) {
    let [flag, setFlag] = getLootFlag(npc)
    let flagSetter = useSetter(flag, setFlag)

    let {takers, amount, splitAmount, takeCount} = getLootGoldDetails(npc)
    let [newGold, setNewGold] = useState("0")
    let setTakers = useSafeSetter(useMappedSetter("goldTakers", flagSetter), [])
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

    return <LeftFloatingPanel>
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className={Styles.Title}><Typography>Gold Loot</Typography><Button className={Styles.PartyButton} onClick={()=>setTakers(getPartyUUIDs)}>P</Button> </div>
            <PartyActorSelector value={takers} setValue={setTakers} />
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
            <div style={{display: "flex", flexDirection: "row"}}>
                <Button disabled={takeCount === 0 || amount === 0} onClick={loot}>Loot Gold</Button>
                {owner ? <Button onClick={setGold}>Add Gold</Button> : null}
            </div>
        </div>
    </LeftFloatingPanel>
}
