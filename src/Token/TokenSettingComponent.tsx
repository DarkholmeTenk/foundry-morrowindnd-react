import {Setting} from "../Settings/Config";
import {TokenSetting} from "./TokenSettings";
import {useCallback, useState} from "react";
import {Button, CircularProgress} from "@material-ui/core";
import {usePromise} from "../Util/Helper/PromiseHelper";
import {loadActor} from "../Util/Identifiers/UuidHelper";
import {ActorChooser} from "../Util/Components/Selector/ActorChooser";
import {StateSetter} from "../Util/React/update/Updater";

interface TokenSettingComponentArgs {
    setting: Setting<TokenSetting>
}


export default function TokenSettingComponent({setting}: TokenSettingComponentArgs) {
    let [current, setCurrent] = useState(setting.value)
    let {result, loading} = usePromise(async ()=>{
        return {
            lootTokenBase: current.lootTokenBase ? await loadActor(current.lootTokenBase) : null,
            sellLootDump: current.sellLootDump ? await loadActor(current.sellLootDump) : null
        }
    }, [current])
    let save = useCallback(()=>setting.value = current, [current, setting])
    let setLootToken = useCallback((x: Actor5e)=>setCurrent({...current, lootTokenBase: x.uuid}), [current])
    let setLootDump = useCallback((x: Actor5e)=>setCurrent({...current, sellLootDump: x.uuid}), [current])
    let potentials = game.actors!.map(x=>x) as Actor5e[]
    if(loading || !result) return <CircularProgress />
    return <div>
        Token settings
        Loot Token Base:
        <ActorChooser potentialActors={potentials} actor={result.lootTokenBase} setChosenActor={setLootToken} />
        Loot Dump:
        <ActorChooser potentialActors={potentials} actor={result.sellLootDump} setChosenActor={setLootDump} />
        <Button onClick={save}>Save</Button>
    </div>
}