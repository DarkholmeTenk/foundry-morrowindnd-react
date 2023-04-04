import {Setting} from "../Settings/Config";
import {TokenSetting} from "./TokenSettings";
import {useCallback, useState} from "react";
import {Avatar, Badge, Button, CircularProgress} from "@material-ui/core";
import {usePromise} from "../Util/Helper/PromiseHelper";
import {loadActor} from "../Util/Identifiers/UuidHelper";
import {ActorChooser} from "../Util/Components/Selector/ActorChooser";
import {StateSetter, useMappedSetter, useSafeSetter} from "../Util/React/update/Updater";
import {useArrayEnableDisable} from "../Util/Helper/ArrayReducers";
import Styles from "./TokenSettingsComponent.module.scss"

function ActorBlob({actor, set, clear, isSet}: {actor: Actor5e, set: (a: UUID)=>void, clear: (a: UUID)=>void, isSet: boolean}) {
    if(isSet) {
        return <Badge badgeContent="X" color="primary" overlap="rectangular" onClick={()=>clear(actor.uuid)}>
            <Avatar onClick={()=>clear(actor.uuid)} src={actor.img} imgProps={{style: {border: '0px'}}} style={{ border: '0px', width: 32, height: 32 }}/>
        </Badge>
    } else {
        return <Avatar onClick={()=>set(actor.uuid)} src={actor.img} imgProps={{style: {border: '0px'}}} style={{ width: 24, height: 24 }}/>
    }
}

function PartyActorSelector({value, setValue}: {value: TokenSetting, setValue: StateSetter<TokenSetting>}) {
    let party = value.partyCharacters ?? []
    let partySetter = useSafeSetter(useMappedSetter("partyCharacters", setValue), [] as UUID[])
    let [enable, disable] = useArrayEnableDisable(partySetter)
    let potentials = game.users.map(x=>x.character)
    return <div className={Styles.PartySelector}>
        {potentials.map((a)=> a ? <ActorBlob key={a.uuid} actor={a} set={enable} clear={disable} isSet={party.includes(a.uuid)} /> : null) }
    </div>
}

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
            <PartyActorSelector value={current} setValue={setCurrent} />
        </div>
        <hr />
        <Button onClick={save}>Save</Button>
    </div>
}