import {Entity} from "./EntityHelper";

export type FlagResult<T> = [T, (T)=>Promise<any>]

export default function getFlag<T extends object>(object: Entity, flagId: string, defaultFlag?: T): FlagResult<T> {
    let defFlag = defaultFlag || {}
    let objectFlag = (object.getFlag("morrowindnd", flagId) as T) ?? {}
    let flag: T = {...defFlag, ...objectFlag}
    // @ts-ignore
    return [flag, (newFlag)=>object.setFlag("morrowindnd", flagId, newFlag)]
}