export type FlagResult<T> = [T, (T)=>Promise<any>]

export default function getFlag<T>(object: Entity, flagId: string, defaultFlag?: T): FlagResult<T> {
    let defFlag = defaultFlag || {}
    let objectFlag = object.getFlag("morrowindnd", flagId) || {}
    let flag: T = {...defFlag, ...objectFlag}
    return [flag, (newFlag)=>object.setFlag("morrowindnd", flagId, newFlag)]
}