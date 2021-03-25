import GoldDisplay from "../../Util/Components/GoldDisplay";
import {Button, Card, CardActions, CardContent, CardHeader, Checkbox} from "@material-ui/core";
import {useCallback} from "react";
import {getGoldDetails, useLootSheetFlag} from "./LootSheetGoldUtil";
import {LootSplitGold} from "./LootAction";
import {getActorId} from "../../Util/Identifiers/ActorID";


function GoldTakerUser({user, takers, setTakers, disabled}) {
    let checked = takers[user.id] || false
    return <div>
        <Checkbox checked={checked} disabled={disabled} onClick={()=>setTakers({...takers, [user.id]: !checked })} />
        {user.name} - {user.character?.name}
    </div>
}

export default function GoldSection({npc, disabled}) {
    let {flag, setFlag} = useLootSheetFlag(npc)

    let {users, takers, amount, splitAmount, takeCount} = getGoldDetails(npc)
    let setTakers=useCallback((newTakers)=> {
        setFlag({...flag, goldTakers: newTakers})
    }, [takers, setFlag])
    let loot = useCallback(()=>{
        LootSplitGold({lootId: getActorId(npc)})
    }, [npc])

    return <Card>
        <CardHeader title="Gold" />
        <CardContent>
            {users.map(user=><GoldTakerUser key={user} {...{user, takers, setTakers, disabled}}/>)}
            <div>
                Total:
                <GoldDisplay value={amount} />
            </div>
            <div>
                Split:
                <GoldDisplay value={splitAmount} />
            </div>
        </CardContent>
        <CardActions>
            <Button disabled={takeCount === 0 || amount === 0} onClick={loot}>Loot Gold</Button>
        </CardActions>
    </Card>
}
