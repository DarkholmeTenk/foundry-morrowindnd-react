export function getFlag<T>(object: Entity, flag: string, defaultFlag?: T): [T, (newValue?: T)=>Promise<any>] {
    let flagObj = object.getFlag("morrowindnd", flag) || defaultFlag
    let setFlag = (newFlag)=>object.setFlag("morrowindnd", flag, newFlag)
    return [flagObj, setFlag]
}