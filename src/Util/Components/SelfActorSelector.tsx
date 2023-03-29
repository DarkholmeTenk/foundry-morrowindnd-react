import React from "react";
import {useWatchEntity} from "../Helper/EntityHelper";

export function useParty() {
    let actor = canvas?.scene?.tokens?.map(x=>x.actor)?.find(x=>x?.name?.toLowerCase() == "party") ?? null
    useWatchEntity(actor)
    return actor
}

export function useCanvasToken(scene: Scene, actor: Actor | null): TokenDocument | null {
    let token = actor ? scene.tokens.find(x=>x.actor?.uuid === actor.uuid) as TokenDocument : null
    useWatchEntity(token)
    return token
}