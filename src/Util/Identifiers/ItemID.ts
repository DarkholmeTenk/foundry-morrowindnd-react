import {ActorId, getActor, getActorId} from "./ActorID";
import {getPack, getPackId, loadPack, PackId} from "./PackId";
import {loadSUuid} from "./UuidHelper";

interface BaseItemId {
    itemId: string,
    uuid: string
}

export interface ItemDirectoryId extends BaseItemId {
}

export interface ItemPackId extends BaseItemId {
    packId: PackId
}

export interface OwnedItemId extends BaseItemId {
    actorId: ActorId
}

export type ItemId = ItemDirectoryId | ItemPackId | OwnedItemId

export function isPackItem(id: ItemId): id is ItemPackId {
    return (id as any).packId
}

export function isOwnedItem(id: ItemId): id is OwnedItemId {
    return (id as any).actorId
}

export async function getItem(id: ItemId): Promise<Item5e | undefined> {
    if(isPackItem(id)) {
        let pack = await loadPack<Item5e>(id.packId)
        return pack?.find(x=>x.id === id.itemId)
    } else {
        return loadSUuid<Item5e>(id.uuid)
    }
}
export async function getItems(ids: ItemId[], skipNotFound: boolean = true): Promise<Item5e[]> {
    let items: Item5e[] = []
    for(let id of ids) {
        let item = await getItem(id)
        if(item) {
            items.push(item)
        } else if(!skipNotFound) {
            throw new Error("Item with id [" + JSON.stringify(id) + "] not found.")
        }
    }
    return items
}

export function getItemId(item: Item): ItemId {
    let base = {itemId: item.id!, uuid: item.uuid}
    if(item.compendium) {
        return {...base, packId: getPackId(item.compendium)}
    } else if(item.actor) {
        return {...base, actorId: getActorId(item.actor)}
    } else {
        return base
    }
}