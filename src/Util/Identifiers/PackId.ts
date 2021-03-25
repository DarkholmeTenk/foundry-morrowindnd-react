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