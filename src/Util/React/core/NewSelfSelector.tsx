import {StateSetter} from "../update/Updater";
import {useCallback} from "react";
import {Avatar, Badge, Chip} from "@material-ui/core";
import {loadActor} from "Util/Identifiers/UuidHelper";
import {useWatchEntity} from "../../Helper/EntityHelper";
import {atom, useAtom} from "jotai";

const DefaultIcon = "icons/svg/mystery-man.svg"
type SelfState = UUID | undefined

export const SelfAtom = atom<SelfState>(undefined)

Hooks.on("ready", ()=>{
    SelfAtom.init = game.user.character?.uuid
})

export function AvatarChip({actor, selected, setSelected, short = false}: {actor: Actor, selected: boolean, setSelected: (v: boolean)=>void, short?: boolean}) {
    let selectMe = useCallback(()=>setSelected(true), [setSelected])
    let clearMe = useCallback(()=>setSelected(false) , [setSelected])
    let image = actor.img ?? DefaultIcon
    if(short) {
        if(selected)
            return <Badge badgeContent="X" color="primary" overlap="rectangular">
                <Avatar onClick={clearMe} src={image} imgProps={{style: {border: '0px'}}} style={{ border: '0px', width: 32, height: 32 }}/>
            </Badge>
        else
            return <Avatar onClick={selectMe} src={image} imgProps={{style: {border: '0px'}}} style={{ width: 24, height: 24 }}/>
    } else {
        return <Chip
            avatar={<Avatar src={image} />}
            color={selected ? "primary" : undefined}
            label={actor.name ?? "Actor?"}
            onClick={selected ? undefined : selectMe}
            onDelete={selected ? clearMe : undefined}
        />
    }
}

function SelfAvatarChip({actor, state, setState, short}: {actor: Actor, state: SelfState, setState: StateSetter<SelfState>, short: boolean}) {
    let id = actor.uuid!
    let setMe = useCallback((v: boolean)=>{
        setState(v ? id : undefined)
    }, [setState, id])
    return <AvatarChip actor={actor} selected={state == actor.uuid} setSelected={setMe} short={short} />
}

export function SelfSelector() {
    let [state, setState] = useAtom(SelfAtom)
    let users = game.users
    let me = game.user
    if(!users || !me) return null
    let potentials = users.map(x=>x.character).filter(x=>x && x.isOwner)
    if(potentials.length == 0) return null
    let short = potentials.length > 3
    return <div style={{display: "flex"}}>
        {potentials.map(actor=>actor ? <SelfAvatarChip key={actor.uuid} actor={actor} state={state} setState={setState} short={short}/> : null)}
    </div>
}

export function useNewSelf(): Actor5e | undefined {
    let [selfId] = useAtom(SelfAtom)
    let actor = selfId ? loadActor.sync(selfId) : undefined
    useWatchEntity(actor)
    return actor
}