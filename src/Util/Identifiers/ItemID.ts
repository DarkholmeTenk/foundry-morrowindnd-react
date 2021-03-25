import {ActorId, getActor, getActorId} from "./ActorID";
import {getPack, getPackId, PackId} from "./PackId";

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

function isPackItem(id: ItemId): id is ItemPackId {
    return (id as any).packId
}

function isOwnedItem(id: ItemId): id is OwnedItemId {
    return (id as any).actorId
}

export async function getItem(id: ItemId): Promise<Item> {
    if(isPackItem(id)) {
        return (await getPack(id.packId).getEntity(id.itemId)) as Item
    } else if(isOwnedItem(id)) {
        return (await getActor(id.actorId)).items.get(id.itemId)
    } else {
        return game.items.get(id.itemId)
    }
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