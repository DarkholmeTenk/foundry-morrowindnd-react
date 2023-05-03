import React from "react";
import {useWatchEntity} from "../Helper/EntityHelper";

export function useParty() {
    let actor = canvas?.scene?.tokens?.map(x=>x.actor)?.find(x=>x?.name?.toLowerCase() == "party") ?? null
    useWatchEntity(actor)
    return actor
}

export function useCanvasToken(scene: Scene | undefined, actor: Actor | null): TokenDocument | null {
    let token: TokenDocument | undefined = undefined
    if(actor) {
        if(actor.token)
            token = actor.token
        else if(scene)
            token = scene.tokens.find(x=>x.actor?.uuid === actor.uuid)
    }
    useWatchEntity(token)
    return token ?? null
}