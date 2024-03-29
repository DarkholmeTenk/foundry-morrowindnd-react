import {callUpdater, SetParam} from "Util/React/update/Updater";

export const FLAG_SCOPE = "MorrowinDnDReact"
export type FlagResult<T> = [T, (t: T)=>Promise<any>]

export default function getFlag<T extends object>(object: DocumentBase, flagId: string, defaultFlag?: T): FlagResult<T> {
    let defFlag = defaultFlag || {}
    let objectFlag = (object.getFlag(FLAG_SCOPE, flagId) as T) ?? {}

    let flag: T = {...defFlag, ...objectFlag}
    // @ts-ignore
    return [flag, (newFlag: SetParam<T>)=>object.setFlag(FLAG_SCOPE, flagId, callUpdater(flag, newFlag))]
}