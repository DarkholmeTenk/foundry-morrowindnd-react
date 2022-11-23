import {loadUUID} from "./UuidHelper";

function isPack(value: any): value is CompendiumCollection<any> {
    return value instanceof CompendiumCollection
}

export type PackId = string
export async function loadPack<T>(packId: PackId | PackId[], tester: Tester<T>, query?: any): Promise<T[]> {
    let packIds = Array.isArray(packId) ? packId : [packId]
    let loadedPacks = await Promise.all(packIds.map(async (id)=>{
        let pack = game.packs.get(id)
        return pack?.getDocuments(query)
    }))
    let values: T[] = []
    loadedPacks.forEach(packEntities=>packEntities?.forEach(entity=>{
        if(entity && tester(entity))
            values.push(entity)
    }))
    return values
}

export function getPackId(pack: CompendiumCollection<any>): PackId {
    return pack.metadata.id
}