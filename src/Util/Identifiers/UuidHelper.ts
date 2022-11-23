type Tester<T> = (value: any)=>value is T
type Source<T> = UUID | T
export async function loadUUID<T>(uuid: Source<T>, tester: Tester<T>): Promise<T | undefined> {
    if(tester(uuid)) return uuid
    let object = await fromUuid(uuid)
    if(object && tester(object))
        return object
}
export function loadUUIDSync<T>(uuid: Source<T>, tester: Tester<T>): T | undefined {
    if(tester(uuid)) return uuid
    let object = fromUuidSync(uuid)
    if(object && tester(object))
        return object
}
type TypedLoad<T> = {
    (uuid: Source<UUID>): Promise<T | undefined>
    sync: (uuid: Source<UUID>)=>T | undefined
}
function typedLoad<T>(tester: Tester<T>): TypedLoad<T> {
    let value = <TypedLoad<T>>((uuid: Source<T>)=>loadUUID(uuid, tester))
    value.sync = (uuid: Source<T>)=>loadUUIDSync(uuid, tester)
    return value
}

export function isActor(value: any): value is Actor5e { return value instanceof Actor }
export const loadActor = typedLoad(isActor)

export function isItem(value: any): value is Item5e { return value instanceof Item }
export const loadItem = typedLoad(isItem)