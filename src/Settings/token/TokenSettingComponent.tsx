import {Setting} from "Settings/Config";
import {TokenSetting} from "Settings/token/TokenSettings";
import {useCallback, useState} from "react";
import {Button, CircularProgress} from "@mui/material";
import {usePromise} from "Util/Helper/PromiseHelper";
import {loadActor} from "Util/Identifiers/UuidHelper";
import {ActorChooser} from "Util/Components/Selector/ActorChooser";
import Styles from "Settings/token/TokenSettingsComponent.module.scss"
import {useMappedSetter, useSafeSetter} from "Util/React/update/Updater";
import {PartyActorSelector} from "Util/Components/PartyActorSelector/PartyActorSelector";

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
    let setPartyTokens = useSafeSetter(useMappedSetter("partyCharacters", setCurrent), [])
    let potentials = game.actors!.map(x=>x) as Actor5e[]
    if(loading || !result) return <CircularProgress />
    return <div>
        Token settings
        <div className={Styles.Field}>
            <span className={Styles.Label}>Loot Token Base:</span>
            <ActorChooser potentialActors={potentials} actor={result.lootTokenBase} setChosenActor={setLootToken} />
        </div>
        <hr />
        <div className={Styles.Field}>
            <span className={Styles.Label}>Loot Dump:</span>
            <ActorChooser potentialActors={potentials} actor={result.sellLootDump} setChosenActor={setLootDump} />
        </div>
        <hr />
        <div className={Styles.Field}>
            <span className={Styles.Label}>Party:</span>
            <PartyActorSelector value={current.partyCharacters ?? []} setValue={setPartyTokens} />
        </div>
        <hr />
        <Button onClick={save}>Save</Button>
    </div>
}