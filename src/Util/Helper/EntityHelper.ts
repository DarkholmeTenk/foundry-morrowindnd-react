import {useEffect, useState} from "react";
import {ActorId, getActor} from "../Identifiers/ActorID";
import {usePromise} from "./PromiseHelper";
import LogFactory from "../Logging";
import {BaseActor, BaseItem} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";

const log = LogFactory("EntityHelper")

export type Entity = Actor5e | Item5e | TokenDocument5e
interface UseEntityParams<T extends Entity> {
    type: string,
    entity: T | null
}

interface UseEntityResult<T extends Entity> {
    value: T | null
}

export function useEntity<T extends Entity>({type, entity}: UseEntityParams<T>): UseEntityResult<T> {
    let [current, setCurrent] = useState({entity})
    let uuid = entity?.uuid
    useEffect(()=>{
        if(!entity) return
        let hookID = Hooks.on(`update${type}`, (newActor)=>{
            if(newActor.uuid == uuid) {
                setCurrent({entity: newActor})
            }
        })
        return ()=>Hooks.off(`update${type}`, hookID as any)
    }, [uuid])

    return {value: current.entity}
}

export function useNPC<T extends Actor5e>(actor: Actor5e | null) {
    let e = actor?.token ?? actor
    let {value} = useEntity({entity: e, type: (e?.constructor as any)?.documentName ?? "Actor"})
    if(value instanceof TokenDocument) {
        return {value: value.actor}
    } else {
        return {value: value}
    }
}

export function useActor(actorId?: ActorId): {value: Actor5e | null, loading: Boolean} {
    console.log("UseActor", actorId)
    let {result, loading} = usePromise(async ()=>actorId ? getActor(actorId) : null, [actorId])
    let {value} = useNPC(loading ? null : result)
    if(loading) return {value: null, loading}
    return {value, loading}
}