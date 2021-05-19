import { getActor, getActorId } from "./ActorID";
import { getPack, getPackId } from "./PackId";
export function isPackItem(id) {
    return id.packId;
}
export function isOwnedItem(id) {
    return id.actorId;
}
export async function getItem(id) {
    if (isPackItem(id)) {
        return (await getPack(id.packId).getEntity(id.itemId));
    }
    else if (isOwnedItem(id)) {
        return (await getActor(id.actorId)).items.get(id.itemId);
    }
    else {
        return game.items.get(id.itemId);
    }
}
export function getItemId(item) {
    if (item.compendium) {
        return { itemId: item.id, packId: getPackId(item.compendium) };
    }
    else if (item.actor) {
        return { itemId: item.id, actorId: getActorId(item.actor) };
    }
    else {
        return { itemId: item.id };
    }
}
