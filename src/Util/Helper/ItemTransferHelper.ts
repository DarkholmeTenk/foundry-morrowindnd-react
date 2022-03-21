import {getItem, OwnedItemId} from "../Identifiers/ItemID";
import {ActorSource, getActor} from "../Identifiers/ActorID";
import LogFactory from "../Logging";
import {cloneItemData} from "./ItemHelper";

const Log = LogFactory("ItemTransferHelper")

export type AddableItemData = any | any[]

export interface ExtraAddItemOptions {
    qty?: number
}

export function fixItemData(itemData: any, options: ExtraAddItemOptions) {
    itemData = cloneItemData(itemData)
    if(itemData.effects && !Array.isArray(itemData.effects)) {
        itemData.effects = Object.values(itemData.effects).map(x=>x)
    }
    if(options?.qty) {
        itemData.data.quantity = options.qty
    }
    return itemData
}

export async function addItem(actorSource: ActorSource, itemData: AddableItemData, options: DocumentModificationContext & ExtraAddItemOptions = {}) {
    let actor = await getActor(actorSource)
    let itemArr = (Array.isArray(itemData) ? itemData : [itemData]).map(i => fixItemData(i, options))
    let updating: any[] = []
    let newArr: any[] = []
    itemArr.forEach(i=>{
        let existing = actor.items.find(x=>x.name == i.name)
        if(existing) {
            updating.push({_id: existing.id, "data.quantity": existing.qty() + (i.data.quantity ?? 1)})
        } else {
            newArr.push(i)
        }
    })
    if(updating.length > 0) {
        await actor.updateEmbeddedDocuments("Item", updating, options)
    }
    if(newArr.length > 0) {
        await actor.createEmbeddedDocuments("Item", newArr, options)
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