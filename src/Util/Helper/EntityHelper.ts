import {useEffect, useState} from "react";
import {usePromise, UsePromiseResult} from "./PromiseHelper";
import LogFactory from "../Logging";
import {useRefresh} from "./useForceUpdate";
import {loadUUID} from "../Identifiers/UuidHelper";

const log = LogFactory("EntityHelper")

function useWatchActorItems(refresh: ()=>void, entity: Actor | undefined | TokenDocument) {
    let a = (entity instanceof TokenDocument) ? entity.actor : entity
    let uuid = a?.uuid
    useEffect(()=>{
        if(!uuid) return
        let hookId = Hooks.on("dnd5e.prepareLeveledSlots", (a: any, actor: Actor5e)=>{
            if(actor.uuid === uuid) refresh()
        })
        return ()=>Hooks.off("dnd5e.prepareLeveledSlots", hookId)
    }, [uuid])
}

function getActor(documentBase: Opt<DocumentBase>) {
    if(documentBase instanceof Actor || documentBase instanceof TokenDocument) return documentBase
    return undefined
}

export function useWatchEntity<T extends DocumentBase>(entity: Opt<T>, onChange?: ()=>void): T | undefined {
    let refresh = useRefresh(onChange)
    let uuid = entity?.uuid
    let type = entity?.documentName
    if(entity instanceof Actor && entity.token) {
        type = "Token"
        uuid = entity.token.uuid
    }
    useWatchActorItems(refresh, getActor(entity))
    useEffect(()=>{
        if(!uuid || !type) return
        let event = `update${type}`
        let hookId = Hooks.on(event, (e)=>{
            if(e.uuid === uuid)
                refresh()
        })
        return ()=>Hooks.off(event, hookId)
    }, [uuid, type, refresh])
    return entity ?? undefined
}

export function useWatchedUuid<T extends DocumentBase>(uuid: Opt<UUID>, tester: Tester<T>): UsePromiseResult<T> {
    let {result, loading} = usePromise(async ()=>{
        if(uuid)
            return await loadUUID(uuid, tester)
    }, [uuid, tester])
    useWatchEntity(result)
    return {result: result ?? null, loading}
}