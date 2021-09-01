import {ActorId, getActor, getActorId} from "./ActorID";
import {getPack, getPackId, loadPack, PackId} from "./PackId";

export interface ItemDirectoryId {
    itemId: string
}

export interface ItemPackId {
    itemId: string
    packId: PackId
}

export interface OwnedItemId {
    actorId: ActorId
    itemId: string
}

export type ItemId = ItemDirectoryId | ItemPackId | OwnedItemId

export function isPackItem(id: ItemId): id is ItemPackId {
    return (id as any).packId
}

export function isOwnedItem(id: ItemId): id is OwnedItemId {
    return (id as any).actorId
}

export async function getItem(id: ItemId): Promise<Item<any>> {
    if(isPackItem(id)) {
        let pack = await loadPack<Item<any>>(id.packId)
        return pack?.find(x=>x.id === id.itemId)
    } else if(isOwnedItem(id)) {
        return (await getActor(id.actorId)).items.get(id.itemId)
    } else {
        return game.items.get(id.itemId)
    }
}
export async function getItems(ids: ItemId[]): Promise<Item[]> {
    let items = []
    for(let id of ids) {
        items.push(await getItem(id))
    }
    return items
}

export function getItemId(item: Item): ItemId {
    if(item.compendium) {
        return {itemId: item.id, packId: getPackId(item.compendium)}
    } else if(item.actor) {
        return {itemId: item.id, actorId: getActorId(item.actor)}
    } else {
        return {itemId: item.id}
    }
}