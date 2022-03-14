import {Entity} from "./EntityHelper";

export type FlagResult<T> = [T, (T)=>Promise<any>]

function fixFlags(object: Entity, flagId: string): unknown | null {
    let flagDoc = object.data.flags
    let oldFlags = flagDoc["morrowindnd"] as object
    let newFlags = flagDoc["MorrowinDnDReact"] as object
    if(oldFlags) {
        Object.keys(oldFlags).forEach(key=>{
            if(!newFlags || !newFlags[key]) {
                // @ts-ignore
                object.setFlag("MorrowinDnDReact", key, oldFlags[key])
            }
        })
        if(oldFlags[flagId] && (!newFlags || !newFlags[flagId])) {
            return oldFlags[flagId]
        }
    }
    return null
}

export default function getFlag<T extends object>(object: Entity, flagId: string, defaultFlag?: T): FlagResult<T> {
    let defFlag = defaultFlag || {}
    let objectFlag = (object.getFlag("MorrowinDnDReact", flagId) as T) ?? {}

    let fixedFlag = fixFlags(object, flagId)
    if(fixedFlag) {
        objectFlag  = fixedFlag as T
    }
    let flag: T = {...defFlag, ...objectFlag}
    // @ts-ignore
    return [flag, (newFlag)=>object.setFlag("MorrowinDnDReact", flagId, newFlag)]
}