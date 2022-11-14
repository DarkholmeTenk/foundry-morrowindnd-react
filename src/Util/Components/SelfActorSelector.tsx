import React, {useRef} from "react";
import {useCallback, useState} from "react";
import {useEntity, useNPC} from "../Helper/EntityHelper";
import {Button, Menu, MenuItem} from "@material-ui/core";

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
    let actor = canvas?.scene?.tokens?.map(x=>x.actor)?.find(x=>x?.name?.toLowerCase() == "party") ?? null
    return useNPC(actor)
}

export function useCanvasToken(scene: Scene, actor: Actor | null): TokenDocument | null {
    let token = actor ? scene.tokens.find(x=>x.actor?.uuid === actor.uuid) as TokenDocument : null
    let {value} = useEntity({entity: token, type: "Token"})
    return value
}