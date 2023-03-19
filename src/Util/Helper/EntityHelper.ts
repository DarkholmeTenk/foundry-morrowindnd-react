import {useEffect, useState} from "react";
import {usePromise, UsePromiseResult} from "./PromiseHelper";
import LogFactory from "../Logging";
import {useRefresh} from "./useForceUpdate";
import {loadUUID} from "../Identifiers/UuidHelper";

const log = LogFactory("EntityHelper")

export function useWatchEntity<T extends DocumentBase>(entity: Opt<T>): T | undefined {
    let refresh = useRefresh()
    let uuid = entity?.uuid
    let type = entity?.documentName
    if(entity instanceof Actor && entity.token) {
        type = "Token"
        uuid = entity.token.uuid
    }
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