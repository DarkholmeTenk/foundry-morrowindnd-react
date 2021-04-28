export interface SimplePackId {
    package: string,
    name: string
}

export type PackId = SimplePackId

export function getPackId(pack: Compendium): PackId {
    return {package: pack.metadata.package, name: pack.metadata.name}
}

export function getPack(id: PackId): Compendium {
    let {package: p, name} = id
    return game.packs.get(`${p}.${name}`)
}

let cache: {[key: string]: Promise<Entity[]>} = {}

function toString(id: PackId) {
    return `${id.package}.${id.name}`
}

export function loadPack<T extends Entity>(id: PackId): Promise<T[]> {
    let idString = toString(id)
    if(!cache[idString]) {
        cache[idString] = getPack(id).getContent()
    }
    return cache[idString] as Promise<T[]>
}

export async function loadPacks<T extends Entity>(ids: PackId[]): Promise<T[]> {
    let entities = await Promise.all(ids.map(id=>loadPack<T>(id)))
    return entities.flatMap(i=>i)
}