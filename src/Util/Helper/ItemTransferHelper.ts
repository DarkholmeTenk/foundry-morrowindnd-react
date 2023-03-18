import LogFactory from "../Logging";
import {cloneItemData} from "./ItemHelper";
import {itemQty} from "../Extension/Items";
import {loadActor, loadItem} from "../Identifiers/UuidHelper";

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

export async function addItem(actorSource: UUID, itemData: AddableItemData, options: any & ExtraAddItemOptions = {}) {
    let actor = loadActor.sync(actorSource)!
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

export async function removeItem(itemId: UUID, qty: number): Promise<any> {
    let item = await loadItem(itemId)
    if(!item) return null
    let iQty = itemQty(item) || 1
    if(qty >= iQty) {
        await item.delete()
    } else {
        await item.update({"data.quantity": iQty - qty})
    }
    return item._source
}