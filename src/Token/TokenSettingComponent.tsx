import {Setting} from "../Constants/Config";
import {TokenSetting} from "./TokenSettings";
import {useCallback, useState} from "react";
import {Button, CircularProgress} from "@material-ui/core";
import {usePromise} from "../Util/Helper/PromiseHelper";
import {getActor, getActorId} from "../Util/Identifiers/ActorID";
import {ActorChooser} from "../Util/Components/SelfActorSelector";

interface TokenSettingComponentArgs {
    setting: Setting<TokenSetting>
}

export default function TokenSettingComponent({setting}: TokenSettingComponentArgs) {
    let [current, setCurrent] = useState(setting.value)
    let {result, loading} = usePromise(async ()=>{
        return {
            lootTokenBase: current.lootTokenBase ? await getActor(current.lootTokenBase) : null,
            sellLootDump: current.sellLootDump ? await getActor(current.sellLootDump) : null
        }
    }, [current])
    let save = useCallback(()=>setting.value = current, [current, setting])
    let setLootToken = useCallback((x)=>setCurrent({...current, lootTokenBase: {actorId: x}}), [current])
    let setLootDump = useCallback((x)=>setCurrent({...current, sellLootDump: {actorId: x}}), [current])
    let potentials = game.actors.map(x=>x)
    if(loading) return <CircularProgress />
    return <div>
        Token settings
        Loot Token Base:
        <ActorChooser potentialActors={potentials} actor={result.lootTokenBase} setChosenActor={setLootToken} />
        Loot Dump:
        <ActorChooser potentialActors={potentials} actor={result.sellLootDump} setChosenActor={setLootDump} />
        <Button onClick={save}>Save</Button>
    </div>
}