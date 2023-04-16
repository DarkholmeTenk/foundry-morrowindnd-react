type Tester<T> = (value: any)=>value is T
type Source<T> = UUID | T

type ExtraMap<T> = (x: any)=>T | undefined

function handleMap<T>(x: any, tester: Tester<T>, map?: ExtraMap<T>): T | undefined {
    if(!x) return undefined
    if(tester(x)) return x
    if(map) {
        let mapped = map(x)
        if(mapped && tester(mapped)) return mapped
    }
}

export async function loadUUID<T>(uuid: Source<T>, tester: Tester<T>, map?: ExtraMap<T>): Promise<T | undefined> {
    if(tester(uuid)) return uuid
    let object = await fromUuid(uuid)
    return handleMap(object, tester, map)
}
export function loadUUIDSync<T>(uuid: Source<T>, tester: Tester<T>, map?: ExtraMap<T>): T | undefined {
    if(tester(uuid)) return uuid
    let object = fromUuidSync(uuid)
    return handleMap(object, tester, map)
}
type TypedLoad<T> = {
    (uuid: Source<UUID>): Promise<T | undefined>
    sync: (uuid: Source<UUID>)=>T | undefined
}
function typedLoad<T>(tester: Tester<T>, map?: ExtraMap<T>): TypedLoad<T> {
    let value = <TypedLoad<T>>((uuid: Source<T>)=>loadUUID(uuid, tester, map))
    value.sync = (uuid: Source<T>)=>loadUUIDSync(uuid, tester, map)
    return value
}

export function isActor(value: any): value is Actor5e { return value instanceof Actor }
export const loadActor = typedLoad(isActor, x=>x instanceof TokenDocument ? x.actor: undefined)

export function isItem(value: any): value is Item5e { return value instanceof Item }
export const loadItem = typedLoad(isItem)

export function isRollTable(value: any): value is RollTable { return value instanceof RollTable }
export const loadRollTable = typedLoad(isRollTable)