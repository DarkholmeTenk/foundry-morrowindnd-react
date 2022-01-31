import React, {ReactElement, useRef} from "react";
import {useCallback, useState} from "react";
import {useEntity, useNPC} from "../Helper/EntityHelper";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {RawActorId} from "../Identifiers/ActorID";

function ActorDisplay({actor}) {
    if(actor) {
        return <React.Fragment>
            <img src={actor.img} style={{width: '20px', height: '20px', border: 'none'}} alt={actor.name} />
            {actor.name}
        </React.Fragment>
    } else {
        return <React.Fragment>No Actor</React.Fragment>
    }
}

function ActorItem({actor, onClick}) {
    let clickHandler = useCallback(()=>onClick(actor), [actor, onClick])
    return <MenuItem onClick={clickHandler}>
        <ActorDisplay actor={actor} />
    </MenuItem>
}

export function ActorChooser({potentialActors, actor, setChosenActor}) {
    let [menuOpen, setMenuOpen] = useState(false)
    let open = useCallback(()=>setMenuOpen(true), [setMenuOpen])
    let close = useCallback(()=>setMenuOpen(false), [setMenuOpen])
    let setActor = useCallback((actor)=>{
        setChosenActor(actor.id)
        close()
    }, [close, setChosenActor])
    let ref = useRef<any>()
    let choices = potentialActors.map(actor=><ActorItem key={actor.id} actor={actor} onClick={setActor} />)
    return <React.Fragment>
        <Button onClick={open} ref={ref}>Selected Actor: <ActorDisplay actor={actor}/></Button>
        <Menu open={menuOpen} anchorEl={ref.current} onClose={close}>
            {choices}
        </Menu>
    </React.Fragment>
}

export function useParty() {
    let actor = canvas?.scene?.tokens?.map(x=>x.actor)?.find(x=>x?.name?.toLowerCase() == "party") ?? undefined
    return useSelf(actor)
}

export default function useSelf(defaultActor?: Actor) {
    let potentialActors = game.actors!.filter(x=>x.isOwner)
    let [chosenActor, setChosenActor] = useState(defaultActor?.id ?? game.user!.character?.id)
    let actorRef = useNPC(chosenActor ? game.actors!.get(chosenActor)! : null)
    let {value: actor} = actorRef
    let component: ReactElement | null = null
    if(potentialActors.length > 1) {
        component = <ActorChooser potentialActors={potentialActors} actor={actor} setChosenActor={setChosenActor} />
    }
    let actorId: RawActorId = {actorId: actor!.id!}
    return {actor, actorId, component, actorRef}
}

export function useCanvasToken(scene: Scene, actor: Actor | null): TokenDocument | null {
    let token = actor ? scene.tokens.find(x=>x.actor?.uuid === actor.uuid) as TokenDocument : null
    let {value} = useEntity({entity: token, type: "Token"})
    return value
}