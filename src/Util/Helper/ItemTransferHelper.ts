import {getItem, OwnedItemId} from "../Identifiers/ItemID";
import {ActorId, getActor} from "../Identifiers/ActorID";
import LogFactory from "../Logging";

const Log = LogFactory("ItemTransferHelper")

function getExisting(itemData: any, actor: Actor): Item | undefined {
    return actor.items.getName(itemData.name)
}

export async function addItem(itemData: any, actorId: ActorId, qty: number) {
    let actor = await getActor(actorId)
    let existing = getExisting(itemData, actor)
    if(existing) {
        let newQty = existing.qty() + qty
        Log.debug("Updating item quantity", actor, existing, newQty)
        await existing.update({"data.quantity": newQty})
    } else {
        if(itemData.data.quantity !== qty) {
            itemData = {
                ...itemData,
                data: {
                    ...itemData.data,
                    quantity: qty
                }
            }
        }
        await Item.create(itemData, {parent: actor})
    }
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