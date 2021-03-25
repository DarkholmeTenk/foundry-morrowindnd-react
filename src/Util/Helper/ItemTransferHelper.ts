import {getItem, OwnedItemId} from "../Identifiers/ItemID";
import {ActorId, getActor} from "../Identifiers/ActorID";

export async function addItem(itemData: any, actorId: ActorId, qty: number) {
    let actor = await getActor(actorId)
    if(itemData.data.quantity !== qty) {
        itemData = {
            ...itemData,
            data: {
                ...itemData.data,
                quantity: qty
            }
        }
    }
    await actor.createOwnedItem(itemData)
}

export async function removeItem(itemId: OwnedItemId, qty: number): Promise<any> {
    let item = await getItem(itemId)
    if(!item) return null
    let itemQty = (item.data.data as any).quantity || 1
    if(qty >= itemQty) {
        await item.delete({})
    } else {
        await item.update({"data.quantity": itemQty - qty})
    }
    return item.data
}